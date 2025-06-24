import axiosInstance from "../../courses/api/courseApi"; // تأكد من أن لديك ملف تهيئة لـ axios

// جلب جميع الكاتيجوريز
export const getCategories = async () => {
  try {
    const response = await axiosInstance.get('/categories');
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch categories');
    } else if (error.request) {
      throw new Error('No response from the server');
    } else {
      throw new Error(error.message || 'Something went wrong');
    }
  }
};

// جلب كاتيجوري معينة باستخدام الـ ID
export const getCategoryById = async (id) => {
  try {
    const response = await axiosInstance.get(`/categories/${id}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Category not found');
    } else if (error.request) {
      throw new Error('No response from the server');
    } else {
      throw new Error(error.message || 'Something went wrong');
    }
  }
};

// إضافة كاتيجوري جديدة
export const addCategory = async (categoryData) => {
  try {
    const response = await axiosInstance.post('/categories', categoryData);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to add category');
    } else if (error.request) {
      throw new Error('No response from the server');
    } else {
      throw new Error(error.message || 'Something went wrong');
    }
  }
};

// تحديث كاتيجوري
export const updateCategory = async (id, categoryData) => {
  try {
    const response = await axiosInstance.put(`/categories/${id}`, categoryData);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to update category');
    } else if (error.request) {
      throw new Error('No response from the server');
    } else {
      throw new Error(error.message || 'Something went wrong');
    }
  }
};

// حذف كاتيجوري
export const deleteCategory = async (id) => {
  try {
    const response = await axiosInstance.delete(`/categories/${id}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to delete category');
    } else if (error.request) {
      throw new Error('No response from the server');
    } else {
      throw new Error(error.message || 'Something went wrong');
    }
  }
};