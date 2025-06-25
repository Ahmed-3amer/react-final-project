import * as yup from "yup";
export const logInAndRegisterSchema = yup.object({
  email: yup
    .string()
    .email("please enter avalid email")
    .required("the email is required for registration"),

  password: yup
    .string()
    .min(8, "please make sure the password is more then 7 char")
    .required("the password is required for registration"),
});


export const registerSchema = yup.object({
  email: yup.string().email("Enter a valid email").required("Email is required"),
  password: yup.string().min(8, "Minimum 8 characters").required("Password is required"),
  name: yup.string().required("Name is required"),
  username: yup.string().required("Username is required"),
  phone: yup.string().matches(/^01[0125][0-9]{8}$/, "Enter a valid Egyptian phone"),
  avatar: yup.mixed().required("Profile picture is required"),
});
