import { setLocale } from "yup";

setLocale({
  mixed: {
    required: "This field is required",
  },
  string: {
    email: "Please enter a valid email",
  },
});
