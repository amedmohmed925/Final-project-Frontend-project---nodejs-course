import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// مسارات المشروع
const srcDir = path.join(__dirname, 'src');
const publicDir = path.join(__dirname, 'public');
const newSrcDir = path.join(__dirname, 'src_new'); // مجلد مؤقت للهيكلية الجديدة

// خريطة لنقل الملفات إلى الهيكلية الجديدة
const fileMapping = {
  // Public
  'background.d202d53710b4a383.jpg': 'public/images/background.jpg',
  'Best-online-course-platforms.webp': 'public/images/best-online-course-platforms.webp',
  'bgCardCourse.png': 'public/images/bgCardCourse.png',
  'bgHeroSection.jpeg': 'public/images/bgHeroSection.jpeg',
  'BLOG.jpg': 'public/images/blog.jpg',
  'image.png': 'public/images/image.png',
  'index.webp': 'public/images/index.webp',
  's.jpg': 'public/images/s.jpg',
  'sd.png': 'public/images/sd.png',
  'student.png': 'public/images/student.png',
  'vite.svg': 'public/vite.svg',

  // src/api
  'src/api/authApi.js': 'src/features/auth/api/authApi.js',
  'src/api/cartApi.js': 'src/features/cart/api/cartApi.js',
  'src/api/categoryApi.js': 'src/features/category/api/categoryApi.js',
  'src/api/communityApi.js': 'src/features/community/api/communityApi.js',
  'src/api/coupon.js': 'src/features/coupon/api/couponApi.js',
  'src/api/courseApi.js': 'src/features/courses/api/courseApi.js',
  'src/api/courseProgressApi.js': 'src/features/courseProgress/api/courseProgressApi.js',
  'src/api/feedbackApi.js': 'src/features/feedback/api/feedbackApi.js',
  'src/api/notificationApi.js': 'src/features/notifications/api/notificationApi.js',
  'src/api/paymentApi.js': 'src/features/payment/api/paymentApi.js',
  'src/api/teacherApi.js': 'src/features/teacher/api/teacherApi.js',
  'src/api/userApi.js': 'src/features/user/api/userApi.js',

  // src/auth
  'src/auth/ForgotPassword.jsx': 'src/features/auth/components/ForgotPassword.jsx',
  'src/auth/Login.jsx': 'src/features/auth/components/Login.jsx',
  'src/auth/Register.jsx': 'src/features/auth/components/Register.jsx',
  'src/auth/ResetPassword.jsx': 'src/features/auth/components/ResetPassword.jsx',

  // src/components
  'src/components/Footer.jsx': 'src/shared/components/Footer.jsx',
  'src/components/HeaderPages.jsx': 'src/shared/components/HeaderPages.jsx',
  'src/components/Logo.jsx': 'src/shared/components/Logo.jsx',
  'src/components/StudentManager.jsx': 'src/features/student/components/StudentManager.jsx',
  'src/components/AdminNotificationSender/AdminNotificationSender.jsx': 'src/features/notifications/components/AdminNotificationSender.jsx',
  'src/components/Cart/Cart.jsx': 'src/features/cart/components/Cart.jsx',
  'src/components/CategoryManager.js/CategoryManager.jsx': 'src/features/category/components/CategoryManager.jsx',
  'src/components/ChatBot/Chat.jsx': 'src/features/chat/components/Chat.jsx',
  'src/components/coureses/AddCourse.jsx': 'src/features/courses/components/AddCourse.jsx',
  'src/components/coureses/CategoryCourses.jsx': 'src/features/courses/components/CategoryCourses.jsx',
  'src/components/coureses/CourseDetails.jsx': 'src/features/courses/components/CourseDetails.jsx',
  'src/components/coureses/EditCourse.jsx': 'src/features/courses/components/EditCourse.jsx',
  'src/components/coureses/LessonPage.jsx': 'src/features/courses/components/LessonPage.jsx',
  'src/components/coureses/MostViewedCoursesSlider.jsx': 'src/features/courses/components/MostViewedCoursesSlider.jsx',
  'src/components/coureses/TeacherCourses.jsx': 'src/features/courses/components/TeacherCourses.jsx',
  'src/components/FeedbackSection.js/FeedbackSection.jsx': 'src/features/feedback/components/FeedbackSection.jsx',
  'src/components/navbar/Header.jsx': 'src/shared/components/Header.jsx',
  'src/components/NavigationBar/NavigationBar.jsx': 'src/shared/components/NavigationBar.jsx',
  'src/components/Notifications/Notifications.jsx': 'src/features/notifications/components/Notifications.jsx',
  'src/components/SearchResults/SearchResults.jsx': 'src/features/search/components/SearchResults.jsx',
  'src/components/TeacherProfile/TeacherProfile.jsx': 'src/features/teacher/components/TeacherProfile.jsx',

  // src/features
  'src/features/cart/cartSlice.js': 'src/features/cart/cartSlice.js',
  'src/features/notifications/notificationSlice.js': 'src/features/notifications/notificationSlice.js',
  'src/features/user/userSlice.js': 'src/features/user/userSlice.js',

  // src/pages
  'src/pages/About/About.jsx': 'src/pages/About.jsx',
  'src/pages/AdminCouponReport/AdminCouponReport.jsx': 'src/features/coupon/components/AdminCouponReport.jsx',
  'src/pages/AdvertiserDashboard/AdvertiserDashboard.jsx': 'src/features/advertiser/components/AdvertiserDashboard.jsx',
  'src/pages/Blog/Blog.jsx': 'src/pages/Blog.jsx',
  'src/pages/Community/Community.jsx': 'src/features/community/components/Community.jsx',
  'src/pages/ContactPage/ContactPage.jsx': 'src/pages/ContactPage.jsx',
  'src/pages/Courses/Courses.jsx': 'src/features/courses/pages/Courses.jsx',
  'src/pages/Home/AchievementsSection.jsx': 'src/pages/Home/AchievementsSection.jsx',
  'src/pages/Home/ChooseUsSection.jsx': 'src/pages/Home/ChooseUsSection.jsx',
  'src/pages/Home/FeaturesSection.jsx': 'src/pages/Home/FeaturesSection.jsx',
  'src/pages/Home/Gallery.jsx': 'src/pages/Home/Gallery.jsx',
  'src/pages/Home/Home.jsx': 'src/pages/Home/Home.jsx',
  'src/pages/Home/ImageContentSection.jsx': 'src/pages/Home/ImageContentSection.jsx',
  'src/pages/Home/ModernEduQuestHero.jsx': 'src/pages/Home/ModernEduQuestHero.jsx',
  'src/pages/Home/StatsSection.jsx': 'src/pages/Home/StatsSection.jsx',
  'src/pages/Home/StudentReviewsSection.jsx': 'src/pages/Home/StudentReviewsSection.jsx',
  'src/pages/Home/TeamSection.jsx': 'src/pages/Home/TeamSection.jsx',

  // src/styles
  'src/styles/About.css': 'src/pages/About.css',
  'src/styles/Achievements.css': 'src/pages/Home/Achievements.css',
  'src/styles/AddCourse.css': 'src/features/courses/styles/AddCourse.css',
  'src/styles/AdminCouponReport.css': 'src/features/coupon/styles/AdminCouponReport.css',
  'src/styles/AdminNotificationSender.css': 'src/features/notifications/styles/AdminNotificationSender.css',
  'src/styles/AdvertiserDashboard.css': 'src/features/advertiser/styles/AdvertiserDashboard.css',
  'src/styles/AllUsers.css': 'src/features/user/styles/AllUsers.css',
  'src/styles/Blog.css': 'src/pages/Blog.css',
  'src/styles/Cart.css': 'src/features/cart/styles/Cart.css',
  'src/styles/CategoryManager.css': 'src/features/category/styles/CategoryManager.css',
  'src/styles/Chat.css': 'src/features/chat/styles/Chat.css',
  'src/styles/ChooseUsSection.css': 'src/pages/Home/ChooseUsSection.css',
  'src/styles/Community.css': 'src/features/community/styles/Community.css',
  'src/styles/ContactPage.css': 'src/pages/ContactPage.css',
  'src/styles/CourseCategiryPage.css': 'src/features/courses/styles/CourseCategoryPage.css',
  'src/styles/CourseDetails.css': 'src/features/courses/styles/CourseDetails.css',
  'src/styles/CourseProgress.css': 'src/features/courseProgress/styles/CourseProgress.css',
  'src/styles/Courses.css': 'src/features/courses/styles/Courses.css',
  'src/styles/FeaturesSection.css': 'src/pages/Home/FeaturesSection.css',
  'src/styles/FeedbackCourse.css': 'src/features/feedback/styles/FeedbackCourse.css',
  'src/styles/Gallery.css': 'src/pages/Home/Gallery.css',
  'src/styles/Header.css': 'src/shared/styles/Header.css',
  'src/styles/HeaderPages.css': 'src/shared/styles/HeaderPages.css',
  'src/styles/Home.css': 'src/pages/Home/Home.css',
  'src/styles/ImageContentSection.css': 'src/pages/Home/ImageContentSection.css',
  'src/styles/LessonPage.css': 'src/features/courses/styles/LessonPage.css',
  'src/styles/MostViewedCourses.css': 'src/features/courses/styles/MostViewedCourses.css',
  'src/styles/Navigation.css': 'src/shared/styles/Navigation.css',
  'src/styles/Notifications.css': 'src/features/notifications/styles/Notifications.css',
  'src/styles/Profile.css': 'src/features/user/styles/Profile.css',
  'src/styles/Register.css': 'src/features/auth/styles/Register.css',
  'src/styles/SidebarProfile.css': 'src/features/user/styles/SidebarProfile.css',
  'src/styles/SocialLogin.css': 'src/features/auth/styles/SocialLogin.css',
  'src/styles/StatsSection.css': 'src/pages/Home/StatsSection.css',
  'src/styles/StudentReviewsSection.css': 'src/pages/Home/StudentReviewsSection.css',
  'src/styles/TeacherProfile.css': 'src/features/teacher/styles/TeacherProfile.css',
  'src/styles/TeamSection.css': 'src/pages/Home/TeamSection.css',
  'src/styles/UpdateInfo.css': 'src/features/user/styles/UpdateInfo.css',
  'src/styles/WhyChooseUsSection.css': 'src/pages/Home/WhyChooseUsSection.css',

  // src/user
  'src/user/AllUsers/AllUsers.jsx': 'src/features/user/components/AllUsers.jsx',
  'src/user/DeleteAccount/DeleteAccount.jsx': 'src/features/user/components/DeleteAccount.jsx',
  'src/user/Profile/Profile.jsx': 'src/features/user/components/Profile.jsx',
  'src/user/SidebarProfile/SidebarProfile.jsx': 'src/features/user/components/SidebarProfile.jsx',
  'src/user/UpdateInfo/UpdateInfo.jsx': 'src/features/user/components/UpdateInfo.jsx',

  // src/app
  'src/app/store.js': 'src/store/store.js',

  // src root
  'src/App.jsx': 'src/App.jsx',
  'src/index.css': 'src/index.css',
  'src/main.jsx': 'src/main.jsx',
};

// دالة لإنشاء المجلدات
async function createDirectory(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  } catch (err) {
    console.error(`Error creating directory ${dir}:`, err);
  }
}

// دالة لنقل الملفات
async function moveFile(src, dest) {
  try {
    const destDir = path.dirname(dest);
    await createDirectory(destDir);
    await fs.rename(src, dest);
    console.log(`Moved ${src} to ${dest}`);
  } catch (err) {
    console.error(`Error moving ${src} to ${dest}:`, err);
  }
}

// دالة لإنشاء ملفات إضافية
async function createAdditionalFiles() {
  const additionalFiles = {
    'src/shared/styles/global.css': `
/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: Arial, sans-serif;
}
`,
    'src/shared/styles/theme.css': `
/* Theme variables */
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --background-color: #f8f9fa;
}
`,
    'src/shared/utils/apiClient.js': `
import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
`,
    'src/shared/utils/constants.js': `
export const API_URL = '/api';
export const ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
};
`,
    'src/routes/index.jsx': `
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import About from '../pages/About';
import Blog from '../pages/Blog';
import ContactPage from '../pages/ContactPage';
import Courses from '../features/courses/pages/Courses';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/blog" element={<Blog />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/courses" element={<Courses />} />
    {/* Add more routes as needed */}
  </Routes>
);

export default AppRoutes;
`,
  };

  for (const [filePath, content] of Object.entries(additionalFiles)) {
    try {
      const destDir = path.dirname(filePath);
      await createDirectory(destDir);
      await fs.writeFile(filePath, content);
      console.log(`Created file: ${filePath}`);
    } catch (err) {
      console.error(`Error creating file ${filePath}:`, err);
    }
  }
}

// الدالة الرئيسية لإعادة الهيكلة
async function restructureProject() {
  try {
    // إنشاء المجلد المؤقت
    await createDirectory(newSrcDir);

    // نقل الملفات بناءً على الخريطة
    for (const [srcPath, destPath] of Object.entries(fileMapping)) {
      const srcFullPath = path.join(__dirname, srcPath);
      const destFullPath = path.join(newSrcDir, destPath);
      try {
        await fs.access(srcFullPath);
        await moveFile(srcFullPath, destFullPath);
      } catch {
        console.warn(`Source file ${srcPath} does not exist`);
      }
    }

    // إنشاء ملفات إضافية
    await createAdditionalFiles();

    // استبدال src القديم بالجديد
    await fs.rm(srcDir, { recursive: true, force: true });
    await fs.rename(newSrcDir, srcDir);
    console.log('Directory restructured successfully!');
  } catch (error) {
    console.error('Error during restructuring:', error);
  }
}

// تشغيل السكربت
restructureProject();