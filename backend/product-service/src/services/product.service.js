import prisma from "../common/prisma/init.prisma.js";

const productService = {
  // Category Service
  addCategory: async (req) => {
    const { name } = req.body;
    const newCategory = await prisma.category.create({
      data: {
        name,
      },
    });

    return newCategory;
  },
  getAllCategory: async () => {
    const listCategory = await prisma.category.findMany();
    return listCategory;
  },
  updateCategory: async (req) => {
    const { id } = req.params;
    const { name } = req.body;
    const category = await prisma.category.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!category) {
      throw new Error("Không tìm thấy danh mục");
    }

    const updateCategory = await prisma.category.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
      },
    });

    return updateCategory;
  },

  // Product Service
  addProduct: async (req) => {
    const { category_id, name, description, price } = req.body;
    const imageUrl = req.file.filename;

    // Kiểm tra giá sản phẩm
    if (isNaN(price) || Number(price) < 0) {
      throw new Error("Giá sản phẩm không hợp lệ");
    }

    // Kiểm tra danh mục có tồn tại hay không
    const category = await prisma.category.findUnique({
      where: {
        id: Number(category_id),
      },
    });
    if (!category) {
      throw new Error("Không tìm thấy danh mục");
    }

    // Tạo sản phẩm mới
    const newProduct = await prisma.product.create({
      data: {
        category_id: Number(category_id),
        name: name,
        description: description,
        price: Number(price),
        imageUrl: imageUrl,
      },
    });

    return newProduct;
  },
  getProductById: async (req) => {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!product) {
      throw new Error("Không tìm thấy sản phẩm");
    }

    return product;
  },
  //
  getProductsByCategory: async (req) => {
    const { id } = req.params;
    // Kiểm tra danh mục có tồn tại hay không
    const category = await prisma.category.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!category) {
      throw new Error("Không tìm thấy danh mục này");
    }

    // Lấy danh sách sản phẩm theo danh mục
    const products = await prisma.product.findMany({
      where: {
        category_id: Number(id),
      },
    });

    if (products.length === 0) {
      throw new Error("Không có sản phẩm nào trong danh mục này");
    }

    // Trả về thông tin sản phẩm, bao gồm cả trạng thái is_available
    return products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      is_available: product.is_available, // Trả về trạng thái is_available
      imageUrl: product.imageUrl,
    }));
  },

  removeProduct: async (req) => {
    const { id } = req.params;

    // Kiểm tra sản phẩm có tồn tại
    const product = await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!product) {
      throw new Error("Sản phẩm không tồn tại");
    }

    // Xóa sản phẩm
    await prisma.product.delete({
      where: {
        id: Number(id),
      },
    });
  },
  setProductAvailability: async (req) => {
    const { id } = req.params;
    // Kiểm tra sản phẩm có tồn tại không
    const product = await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!product) {
      throw new Error("Sản phẩm không tồn tại");
    }

    // Chuyển trạng thái sản phẩm
    const updateProduct = await prisma.product.update({
      where: {
        id: Number(id),
      },
      data: {
        is_available: !product.is_available,
      },
    });

    return updateProduct;
  },
};

export default productService;
