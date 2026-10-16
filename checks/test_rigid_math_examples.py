"""核对R-TA-001的合成数学例；不是产品实现、机床验证或生产公差规范。"""
from __future__ import annotations

import unittest

Matrix = tuple[tuple[float, ...], ...]
IDENTITY: Matrix = ((1, 0, 0, 0), (0, 1, 0, 0), (0, 0, 1, 0), (0, 0, 0, 1))


def multiply(a: Matrix, b: Matrix) -> Matrix:
    """仅供本文件的4×4合成矩阵计算，不作为正式端口实现。"""
    if len(a) != 4 or len(b) != 4 or any(len(row) != 4 for row in a + b):
        raise ValueError("示例矩阵必须为4×4")
    return tuple(tuple(sum(a[i][k] * b[k][j] for k in range(4)) for j in range(4)) for i in range(4))


def translate(x: float = 0, y: float = 0, z: float = 0) -> Matrix:
    return ((1, 0, 0, x), (0, 1, 0, y), (0, 0, 1, z), (0, 0, 0, 1))


class RigidMathExamples(unittest.TestCase):
    def assert_matrix_equal(self, actual: Matrix, expected: Matrix) -> None:
        # 小规模精确合成数据的比较精度，不代表真实几何或机床容差。
        for actual_row, expected_row in zip(actual, expected):
            for actual_value, expected_value in zip(actual_row, expected_row):
                self.assertAlmostEqual(actual_value, expected_value, places=12)

    def test_coaxial_80_plus_20(self) -> None:
        self.assert_matrix_equal(multiply(translate(z=80), translate(z=20)), translate(z=100))

    def test_declared_mount_and_tcp(self) -> None:
        # 绕x轴正向90度后，局部+z转为父系-y。
        mount = ((1, 0, 0, 10), (0, 0, -1, 20), (0, 1, 0, 30), (0, 0, 0, 1))
        tcp = multiply(mount, translate(z=100))
        self.assertEqual(tuple(tcp[i][3] for i in range(3)), (10, -80, 30))

    def test_inverse_of_declared_mount(self) -> None:
        mount = ((1, 0, 0, 10), (0, 0, -1, 20), (0, 1, 0, 30), (0, 0, 0, 1))
        inverse = ((1, 0, 0, -10), (0, 0, 1, -30), (0, -1, 0, 20), (0, 0, 0, 1))
        self.assert_matrix_equal(multiply(mount, inverse), IDENTITY)
        self.assert_matrix_equal(multiply(inverse, mount), IDENTITY)

    def test_rotation_and_translation_are_not_commutative(self) -> None:
        rotation = ((0, -1, 0, 0), (1, 0, 0, 0), (0, 0, 1, 0), (0, 0, 0, 1))
        a = multiply(rotation, translate(x=2))
        b = multiply(translate(x=2), rotation)
        self.assertEqual(tuple(a[i][3] for i in range(3)), (0, 2, 0))
        self.assertEqual(tuple(b[i][3] for i in range(3)), (2, 0, 0))
        self.assertNotEqual(a, b)

    def test_declared_relative_offset_is_not_gauge_length(self) -> None:
        # 仅检验明确给定参考方式的算术，不模拟任何控制器指令。
        gauge_length_mm, master_length_mm = 100, 90
        relative_offset_mm = gauge_length_mm - master_length_mm
        self.assertEqual(relative_offset_mm, 10)
        self.assertNotEqual(relative_offset_mm, gauge_length_mm)
        self.assertEqual(master_length_mm + relative_offset_mm, gauge_length_mm)

    def test_recompute_from_immutable_base_is_repeatable(self) -> None:
        base, extension = translate(z=80), translate(z=20)
        first = multiply(base, extension)
        self.assertEqual(multiply(base, extension), first)
        # 旧显示结果再次叠加同一伸出量是错误的120，而非100。
        self.assertEqual(multiply(first, extension)[2][3], 120)
        self.assertNotEqual(multiply(first, extension), first)


if __name__ == "__main__":
    unittest.main(verbosity=2)
