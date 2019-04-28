import React from "react";
import * as yup from "yup";
import AdminList from "./AdminList";
import { AdminContext } from "./useAdmin";

const initialValues = {
  uid: "",
  email: "",
  password: "",
  password2: ""
};

const schema = yup.object<typeof initialValues>().shape({
  email: yup
    .string()
    .email()
    .required(),
  password: yup.string().notRequired(),
  password2: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords don't match")
    .notRequired()
});

const columns: Array<{
  name: keyof typeof initialValues;
  title: string;
  placeholder: string;
  type: string;
  width: string;
}> = [
  {
    name: "email",
    title: "Email",
    placeholder: "email",
    type: "email",
    width: "33%"
  },
  {
    name: "password",
    title: "Password",
    placeholder: "password",
    type: "password",
    width: "33%"
  },
  {
    name: "password2",
    title: "",
    placeholder: "confirm password",
    type: "password",
    width: "33%"
  }
];

const EmployeeList: React.FC = () => {
  const { employees } = React.useContext(AdminContext);
  return (
    <AdminList
      columns={columns}
      schema={schema}
      initialFormValues={initialValues}
      {...employees}
    />
  );
};

export default EmployeeList;
