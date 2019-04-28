import React from "react";
import * as yup from "yup";
import AdminList from "./AdminList";
import { AdminContext } from "./useAdmin";

const initialValues = {
  uid: "",
  name: ""
};

const schema = yup.object<typeof initialValues>().shape({
  name: yup.string().required()
});

const columns: Array<{
  name: keyof typeof initialValues;
  title: string;
  placeholder: string;
  type: string;
  width: string;
}> = [
  {
    name: "name",
    title: "Name",
    placeholder: "name",
    type: "text",
    width: "100%"
  }
];

const DoorList: React.FC = () => {
  const { doors } = React.useContext(AdminContext);
  return (
    <AdminList
      columns={columns}
      schema={schema}
      initialFormValues={initialValues}
      {...doors}
    />
  );
};

export default DoorList;
