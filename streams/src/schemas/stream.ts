import * as yup from "yup";

export const createNewStream = yup.object().shape({
  title: yup.string().required(),
  //hub: yup.string().required(),
});
