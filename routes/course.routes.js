import {Router} from "express";
import { createCourse, removeCourse, getAllCourses, getLecturesBycourseId, editCourse, addLectureToCourseById, deleteLecture } from "../controllers/course.controller.js";
import { authorizedRoles, isLoggedIn } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
// import upload from "../middlewares/multer.middleware.js";
const router=Router();
router.route("/")
.get(getAllCourses)
.post(isLoggedIn,
    authorizedRoles("ADMIN"),
    upload.single("thumbnail") ,
    createCourse);
    // router.route("lecture/:id")
    // .delete(isLoggedIn,authorizedRoles("ADMIN"),deleteLecture)
// router.route("/:id").put(
//     isLoggedIn,
//     authorizedRoles("ADMIN"),
//     // upload.single("thumbnail") ,
//     editCourse
// )


router.route("/:id")
.get(isLoggedIn ,
    getLecturesBycourseId)
.put(
    isLoggedIn,
    authorizedRoles("ADMIN"),
    // upload.single("thumbnail") ,
    editCourse)

.delete(isLoggedIn,
     authorizedRoles("ADMIN"),
     deleteLecture)
.post(isLoggedIn,
      authorizedRoles("ADMIN"),
      upload.single("lecture"),
      addLectureToCourseById,
     );
export default router;