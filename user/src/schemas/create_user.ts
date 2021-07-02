import * as yup from "yup";

export const createDevUserSchema = yup.object().shape({
  username: yup.string().required(),
  last_name: yup.string().required(),
  first_name: yup.string().required(),
  email: yup.string().required(),
  password: yup.string().required(),
});
