import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import Switch from "@material-ui/core/Switch";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import { AdminContext } from "./useAdmin";

const AuthorizationList: React.FC = () => {
  const { employees, doors, authorizations } = React.useContext(AdminContext);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Employee</TableCell>
          <TableCell>Doors</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {employees.values.map(employee => (
          <TableRow key={employee.uid}>
            <TableCell>{employee.email}</TableCell>
            <TableCell>
              <FormGroup>
                {doors.values.map(door => {
                  const auth = authorizations.values.find(
                    a => a.employeeId === employee.uid && a.doorId === door.uid
                  );
                  return (
                    <FormControlLabel
                      key={door.uid}
                      control={
                        <Switch
                          onChange={() => {
                            auth
                              ? authorizations.delete(auth.uid)
                              : authorizations.add({
                                  employeeId: employee.uid,
                                  doorId: door.uid
                                });
                          }}
                          checked={!!auth}
                        />
                      }
                      label={door.name}
                    />
                  );
                })}
              </FormGroup>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AuthorizationList;
