import * as yup from "yup";

let addSchema = yup.object().shape({
  lineOne: yup
    .string()
    .required("Required input")
    .min(2, "must enter valid Address"),
  city: yup.string().required("Required input"),
  stateCode: yup
    .string()
    .required("Required input")
    .max(2)
});

export { addSchema };
