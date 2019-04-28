import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import green from "@material-ui/core/colors/green";
import red from "@material-ui/core/colors/red";
import {
  createStyles,
  withStyles,
  Theme,
  WithStyles
} from "@material-ui/core/styles";
import clsx from "clsx";
import React from "react";
import { AdminContext } from "./useAdmin";

const styles = (theme: Theme) =>
  createStyles({
    result: {
      padding: 4,
      borderRadius: theme.shape.borderRadius
    },
    opened: {
      backgroundColor: green[500],
      color: theme.palette.getContrastText(green[500])
    },
    rejected: {
      backgroundColor: red[500],
      color: theme.palette.getContrastText(red[500])
    }
  });

const EventsList: React.FC<WithStyles<typeof styles>> = ({ classes }) => {
  const { employees, doors, events } = React.useContext(AdminContext);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Date</TableCell>
          <TableCell>Employee</TableCell>
          <TableCell>Door</TableCell>
          <TableCell>Result</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {events.values.map(event => (
          <TableRow key={event.uid}>
            <TableCell>{new Date(event.date).toISOString()}</TableCell>
            <TableCell>
              {
                (
                  employees.values.find(e => e.uid === event.employeeId) || {
                    email: "DELETED"
                  }
                ).email
              }
            </TableCell>
            <TableCell>
              {
                (
                  doors.values.find(d => d.uid === event.doorId) || {
                    name: "DELETED"
                  }
                ).name
              }
            </TableCell>
            <TableCell>
              <span
                className={clsx(classes.result, {
                  [classes.opened]: event.success,
                  [classes.rejected]: !event.success
                })}
              >
                {event.success ? "opened" : "rejected"}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default withStyles(styles)(EventsList);
