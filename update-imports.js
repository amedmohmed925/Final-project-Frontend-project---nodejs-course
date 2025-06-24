import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sync as glob } from 'glob';

// Get __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// مسار مجلد src
const srcDir = path.join(__dirname, 'src');

// خريطة الاستيرادات القديمة إلى الجديدة
const importMapping = {
  // src/api
  '../api/authApi': '../features/auth/api/authApi',
  '../api/cartApi': '../features/cart/api/cartApi',
  '../api/categoryApi': '../features/category/api/categoryApi',
  '../api/communityApi': '../features/community/api/communityApi',
  '../api/coupon': '../features/coupon/api/couponApi',
  '../api/courseApi': '../features/courses/api/courseApi',
  '../api/courseProgressApi': '../features/courseProgress/api/courseProgressApi',
  '../api/feedbackApi': '../features/feedback/api/feedbackApi',
  '../api/notificationApi': '../features/notifications/api/notificationApi',
  '../api/paymentApi': '../features/payment/api/paymentApi',
  '../api/teacherApi': '../features/teacher/api/teacherApi',
  '../api/userApi': '../features/user/api/userApi',

  // src/auth
  '../auth/ForgotPassword': '../features/auth/components/ForgotPassword',
  '../auth/Login': '../features/auth/components/Login',
  '../auth/Register': '../features/auth/components/Register',
  '../auth/ResetPassword': '../features/auth/components/ResetPassword',

  // src/components
  '../components/Footer': '../shared/components/Footer',
  '../components/HeaderPages': '../shared/components/HeaderPages',
  '../components/Logo': '../shared/components/Logo',
  '../components/StudentManager': '../features/student/components/StudentManager',
  '../components/AdminNotificationSender/AdminNotificationSender': '../features/notifications/components/AdminNotificationSender',
  '../components/Cart/Cart': '../features/cart/components/Cart',
  '../components/CategoryManager.js/CategoryManager': '../features/category/components/CategoryManager',
  '../components/ChatBot/Chat': '../features/chat/components/Chat',
  '../components/coureses/AddCourse': '../features/courses/components/AddCourse',
  '../components/coureses/CategoryCourses': '../features/courses/components/CategoryCourses',
  '../components/coureses/CourseDetails': '../features/courses/components/CourseDetails',
  '../components/coureses/EditCourse': '../features/courses/components/EditCourse',
  '../components/coureses/LessonPage': '../features/courses/components/LessonPage',
  '../components/coureses/MostViewedCoursesSlider': '../features/courses/components/MostViewedCoursesSlider',
  '../components/coureses/TeacherCourses': '../features/courses/components/TeacherCourses',
  '../components/FeedbackSection.js/FeedbackSection': '../features/feedback/components/FeedbackSection',
  '../components/navbar/Header': '../shared/components/Header',
  '../components/NavigationBar/NavigationBar': '../shared/components/NavigationBar',
  '../components/Notifications/Notifications': '../features/notifications/components/Notifications',
  '../components/SearchResults/SearchResults': '../features/search/components/SearchResults',
  '../components/TeacherProfile/TeacherProfile': '../features/teacher/components/TeacherProfile',

  // src/features
  '../features/cart/cartSlice': '../features/cart/cartSlice',
  '../features/notifications/notificationSlice': '../features/notifications/notificationSlice',
  '../features/user/userSlice': '../features/user/userSlice',

  // src/pages
  '../pages/About/About': '../pages/About',
  '../pages/AdminCouponReport/AdminCouponReport': '../features/coupon/components/AdminCouponReport',
  '../pages/AdvertiserDashboard/AdvertiserDashboard': '../features/advertiser/components/AdvertiserDashboard',
  '../pages/Blog/Blog': '../pages/Blog',
  '../pages/Community/Community': '../features/community/components/Community',
  '../pages/ContactPage/ContactPage': '../pages/ContactPage',
  '../pages/Courses/Courses': '../features/courses/pages/Courses',
  '../pages/Home/AchievementsSection': '../pages/Home/AchievementsSection',
  '../pages/Home/ChooseUsSection': '../pages/Home/ChooseUsSection',
  '../pages/Home/FeaturesSection': '../pages/Home/FeaturesSection',
  '../pages/Home/Gallery': '../pages/Home/Gallery',
  '../pages/Home/Home': '../pages/Home/Home',
  '../pages/Home/ImageContentSection': '../pages/Home/ImageContentSection',
  '../pages/Home/ModernEduQuestHero': '../pages/Home/ModernEduQuestHero',
  '../pages/Home/StatsSection': '../pages/Home/StatsSection',
  '../pages/Home/StudentReviewsSection': '../pages/Home/StudentReviewsSection',
  '../pages/Home/TeamSection': '../pages/Home/TeamSection',

  // src/styles
  '../styles/About': '../pages/About',
  '../styles/Achievements': '../pages/Home/Achievements',
  '../styles/AddCourse': '../features/courses/styles/AddCourse',
  '../styles/AdminCouponReport': '../features/coupon/styles/AdminCouponReport',
  '../styles/AdminNotificationSender': '../features/notifications/styles/AdminNotificationSender',
  '../styles/AdvertiserDashboard': '../features/advertiser/styles/AdvertiserDashboard',
  '../styles/AllUsers': '../features/user/styles/AllUsers',
  '../styles/Blog': '../pages/Blog',
  '../styles/Cart': '../features/cart/styles/Cart',
  '../styles/CategoryManager': '../features/category/styles/CategoryManager',
  '../styles/Chat': '../features/chat/styles/Chat',
  '../styles/ChooseUsSection': '../pages/Home/ChooseUsSection',
  '../styles/Community': '../features/community/styles/Community',
  '../styles/ContactPage': '../pages/ContactPage',
  '../styles/CourseCategiryPage': '../features/courses/styles/CourseCategoryPage',
  '../styles/CourseDetails': '../features/courses/styles/CourseDetails',
  '../styles/CourseProgress': '../features/courseProgress/styles/CourseProgress',
  '../styles/Courses': '../features/courses/styles/Courses',
  '../styles/FeaturesSection': '../pages/Home/FeaturesSection',
  '../styles/FeedbackCourse': '../features/feedback/styles/FeedbackCourse',
  '../styles/Gallery': '../pages/Home/Gallery',
  '../styles/Header': '../shared/styles/Header',
  '../styles/HeaderPages': '../shared/styles/HeaderPages',
  '../styles/Home': '../pages/Home/Home',
  '../styles/ImageContentSection': '../pages/Home/ImageContentSection',
  '../styles/LessonPage': '../features/courses/styles/LessonPage',
  '../styles/MostViewedCourses': '../features/courses/styles/MostViewedCourses',
  '../styles/Navigation': '../shared/styles/Navigation',
  '../styles/Notifications': '../features/notifications/styles/Notifications',
  '../styles/Profile': '../features/user/styles/Profile',
  '../styles/Register': '../features/auth/styles/Register',
  '../styles/SidebarProfile': '../features/user/styles/SidebarProfile',
  '../styles/SocialLogin': '../features/auth/styles/SocialLogin',
  '../styles/StatsSection': '../pages/Home/StatsSection',
  '../styles/StudentReviewsSection': '../pages/Home/StudentReviewsSection',
  '../styles/TeacherProfile': '../features/teacher/styles/TeacherProfile',
  '../styles/TeamSection': '../pages/Home/TeamSection',
  '../styles/UpdateInfo': '../features/user/styles/UpdateInfo',
  '../styles/WhyChooseUsSection': '../pages/Home/WhyChooseUsSection',

  // src/user
  '../user/AllUsers/AllUsers': '../features/user/components/AllUsers',
  '../user/DeleteAccount/DeleteAccount': '../features/user/components/DeleteAccount',
  '../user/Profile/Profile': '../features/user/components/Profile',
  '../user/SidebarProfile/SidebarProfile': '../features/user/components/SidebarProfile',
  '../user/UpdateInfo/UpdateInfo': '../features/user/components/UpdateInfo',

  // src/app
  '../app/store': '../store/store',
};

// دالة لتحديث الاستيرادات في ملف واحد
async function updateImportsInFile(filePath) {
  try {
    let content = await fs.readFile(filePath, 'utf8');
    let updated = false;

    // البحث عن الاستيرادات واستبدالها
    for (const [oldPath, newPath] of Object.entries(importMapping)) {
      // استخدام تعبير منتظم لمطابقة مسارات الاستيراد
      const regex = new RegExp(`(from\\s*['"])${oldPath.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}(['"])`, 'g');
      if (regex.test(content)) {
        content = content.replace(regex, `$1${newPath}$2`);
        updated = true;
        console.log(`Updated import in ${filePath}: ${oldPath} -> ${newPath}`);
      }
    }

    // كتابة الملف إذا تم التعديل
    if (updated) {
      await fs.writeFile(filePath, content);
      console.log(`Saved changes to ${filePath}`);
    }
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err);
  }
}

// دالة لمعالجة جميع الملفات
async function updateAllImports() {
  try {
    // البحث عن جميع ملفات .jsx و.js و.css
    const files = glob(path.join(srcDir, '**/*.{jsx,js,css}'), { nodir: true });
    console.log(`Found ${files.length} files to process.`);

    // معالجة كل ملف
    for (const file of files) {
      await updateImportsInFile(file);
    }

    console.log('Import updates completed successfully!');
  } catch (err) {
    console.error('Error during import updates:', err);
  }
}

// تشغيل السكربت
updateAllImports();