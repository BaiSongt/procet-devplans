"""规划用合成反例；不导入产品代码，不授予装夹、碰撞或上机资格。"""
import math
import unittest


def eye():
    return [[float(i == j) for j in range(4)] for i in range(4)]


def mul(a, b):
    return [[sum(x*y for x, y in zip(row, col)) for col in zip(*b)] for row in a]


def apply(t, xyz, point=True):
    v = [*xyz, float(point)]
    return [sum(a*b for a, b in zip(row, v)) for row in t[:3]]


def translation(x, y, z):
    t = eye()
    for i, v in enumerate((x, y, z)):
        t[i][3] = v
    return t


def rz(a):
    c, s = math.cos(a), math.sin(a)
    return [[c, -s, 0, 0], [s, c, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]


def validate_rigid(t, eps=1e-9):
    # eps仅为本合成算例数值误差阈值，不是产品几何公差。
    if len(t) != 4 or any(len(r) != 4 for r in t):
        raise ValueError('matrix_shape')
    if not all(math.isfinite(v) for r in t for v in r):
        raise ValueError('non_finite')
    if any(abs(x-y) > eps for x, y in zip(t[3], (0, 0, 0, 1))):
        raise ValueError('homogeneous_row')
    r = [row[:3] for row in t[:3]]
    gram = mul(list(zip(*r)), r)
    if any(abs(gram[i][j] - (i == j)) > eps for i in range(3) for j in range(3)):
        raise ValueError('not_orthonormal')
    det = sum(r[0][j]*(r[1][(j+1)%3]*r[2][(j+2)%3]-r[1][(j+2)%3]*r[2][(j+1)%3]) for j in range(3))
    if abs(det-1) > eps:
        raise ValueError('improper_rotation')


def inverse(t):
    validate_rigid(t)
    v = eye()
    for i in range(3):
        for j in range(3):
            v[i][j] = t[j][i]
        v[i][3] = -sum(v[i][j]*t[j][3] for j in range(3))
    return v


def mate(parent, parent_interface, relation, child_interface):
    # relation显式定义两个配合接口间关系；不猜测自动翻转。
    for t in (parent, parent_interface, relation, child_interface):
        validate_rigid(t)
    return mul(mul(mul(parent, parent_interface), relation), inverse(child_interface))


def cross(a, b):
    return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]]


def contact_rows(points, normals, length):
    if not math.isfinite(length) or length <= 0 or len(points) != len(normals):
        raise ValueError('contact_scale')
    rows = []
    for p, n in zip(points, normals):
        if len(p) != 3 or len(n) != 3 or not all(math.isfinite(x) for x in [*p, *n]):
            raise ValueError('contact_input')
        if abs(sum(x*x for x in n)-1) > 1e-9:
            raise ValueError('unit_normal_required')
        rows.append([*n, *(x/length for x in cross(p, n))])
    return rows


def rank(a, eps=1e-9):
    # 只用于远离奇异阈值的合成矩阵；生产端需尺度化SVD与版本化容差。
    a = [list(row) for row in a]
    k = 0
    for j in range(len(a[0])):
        i = max(range(k, len(a)), key=lambda i: abs(a[i][j]))
        if abs(a[i][j]) <= eps:
            continue
        a[k], a[i] = a[i], a[k]
        scale = a[k][j]
        a[k] = [v/scale for v in a[k]]
        for i in range(len(a)):
            if i != k:
                f = a[i][j]
                a[i] = [x-f*y for x, y in zip(a[i], a[k])]
        k += 1
        if k == len(a):
            break
    return k


def friction_check(mu, normal, tangential):
    # 单接触Coulomb示例，不是全夹具静力或有限元分析。
    if mu is None:
        return 'unknown'
    if not all(math.isfinite(v) for v in [mu, normal, *tangential]) or mu < 0 or normal < 0:
        raise ValueError('invalid_contact_force')
    return 'within_model' if math.sqrt(sum(v*v for v in tangential)) <= mu*normal else 'outside_model'


POINTS = [(-1,-1,0), (1,-1,0), (0,1,0), (-1,-1,1), (1,-1,1), (-1,0,1)]
NORMALS = [(0,0,1)]*3 + [(0,1,0)]*2 + [(1,0,0)]


class WorkholdingMathExamples(unittest.TestCase):
    def close(self, a, b):
        for x, y in zip(a, b):
            self.assertAlmostEqual(x, y, places=8)

    def test_m01_identity(self):
        validate_rigid(eye())

    def test_m02_inverse_roundtrip(self):
        t = mul(translation(10,20,30), rz(.7))
        self.close(apply(inverse(t), apply(t, [2,3,4])), [2,3,4])

    def test_m03_noncommuting(self):
        a, b = rz(math.pi/2), translation(10,0,0)
        self.close(apply(mul(a,b), [0,0,0]), [0,10,0])
        self.close(apply(mul(b,a), [0,0,0]), [10,0,0])

    def test_m04_interface_closure(self):
        p, i, m, j = translation(10,20,0), rz(.7), translation(3,4,5), translation(0,0,2)
        child = mate(p,i,m,j)
        for a, b in zip(mul(child,j), mul(mul(p,i),m)):
            self.close(a,b)

    def test_m05_absolute_target_repeat(self):
        args = (translation(10,0,0), rz(.4), eye(), translation(0,0,2))
        first = mate(*args)
        self.assertEqual(first, mate(*args))
        self.assertEqual(first, mate(*args))

    def test_m06_reflection_rejected(self):
        t = eye(); t[0][0] = -1
        with self.assertRaises(ValueError): validate_rigid(t)

    def test_m07_scale_rejected(self):
        t = eye(); t[0][0] = 2
        with self.assertRaises(ValueError): validate_rigid(t)

    def test_m08_nan_rejected(self):
        t = eye(); t[0][3] = float('nan')
        with self.assertRaises(ValueError): validate_rigid(t)

    def test_m09_last_row_rejected(self):
        t = eye(); t[3][0] = 1
        with self.assertRaises(ValueError): validate_rigid(t)

    def test_m10_point_and_direction(self):
        t = translation(10,20,30)
        self.close(apply(t, [1,0,0]), [11,20,30])
        self.close(apply(t, [1,0,0], False), [1,0,0])

    def test_m11_rotated_parent_normal(self):
        self.close(apply(rz(math.pi/2), [1,0,0], False), [0,1,0])

    def test_m12_rotary_pivot(self):
        t = mul(mul(translation(2,0,0), rz(math.pi/2)), translation(-2,0,0))
        self.close(apply(t, [3,0,0]), [2,1,0])

    def test_m13_units_boundary(self):
        self.assertAlmostEqual(2*25.4, 50.8)
        self.assertAlmostEqual(180*math.pi/180, math.pi)

    def test_m14_bilateral_rank_six(self):
        self.assertEqual(rank(contact_rows(POINTS,NORMALS,2)), 6)

    def test_m15_rank_six_still_can_lift(self):
        a = contact_rows(POINTS,NORMALS,2)
        q = (0,0,1,0,0,0)
        gaps = [sum(x*y for x,y in zip(row,q)) for row in a]
        self.assertTrue(all(g >= 0 for g in gaps))
        self.assertTrue(any(g > 0 for g in gaps))

    def test_m16_collinear_support_rank_loss(self):
        points = [(-1,-1,0), (0,-1,0), (1,-1,0), *POINTS[3:]]
        self.assertLess(rank(contact_rows(points,NORMALS,2)), 6)

    def test_m17_redundant_row_no_extra_constraint(self):
        a = contact_rows(POINTS,NORMALS,2)
        self.assertEqual(rank(a+[a[0]]), rank(a))

    def test_m18_scaled_units_same_rank_matrix(self):
        a = contact_rows(POINTS,NORMALS,2)
        b = contact_rows([[x*.001 for x in p] for p in POINTS],NORMALS,.002)
        for x, y in zip(a,b): self.close(x,y)

    def test_m19_force_bound(self):
        self.assertEqual(friction_check(.2,500,[80,0]), 'within_model')
        self.assertEqual(friction_check(.2,500,[120,0]), 'outside_model')

    def test_m20_missing_mu_unknown(self):
        self.assertEqual(friction_check(None,500,[80,0]), 'unknown')

    def test_m21_tension_not_compressive_contact(self):
        with self.assertRaises(ValueError): friction_check(.2,-500,[0,0])

    def test_m22_cone_not_independent_axes(self):
        self.assertEqual(friction_check(.2,500,[80,80]), 'outside_model')


if __name__ == '__main__':
    unittest.main(verbosity=2)
