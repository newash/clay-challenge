import useFormal from "@kevinwolf/formal-web";
import Fab from "@material-ui/core/Fab";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import {
  createStyles,
  withStyles,
  Theme,
  WithStyles
} from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear";
import DeleteIcon from "@material-ui/icons/Delete";
import DoneIcon from "@material-ui/icons/Done";
import EditIcon from "@material-ui/icons/Edit";
import React from "react";
import * as yup from "yup";
import { getTextFieldProps } from "../formHelpers";

interface AdminListProps<V extends { uid: string }> {
  columns: Array<{
    name: keyof Partial<V>;
    title: string;
    placeholder: string;
    type: string;
    width: string;
  }>;
  schema: yup.Schema<V>;
  initialFormValues: V;
  values: Array<Partial<V>>;
  add: (param: Pick<V, Exclude<keyof V, "uid">>) => Promise<boolean>;
  modify: (param: V) => Promise<boolean>;
  delete: (uid: string) => Promise<boolean>;
}

const styles = (theme: Theme) =>
  createStyles({
    actionCell: {
      whiteSpace: "nowrap"
    },
    fab: {
      position: "absolute",
      bottom: theme.spacing.unit * 2,
      right: theme.spacing.unit * 2
    }
  });

const AdminTable = <V extends { uid: string }>(
  props: {
    formValues: V;
    setFormValues: React.Dispatch<V>;
  } & AdminListProps<V> &
    WithStyles<typeof styles>
) => {
  const formal = useFormal(props.formValues, {
    schema: props.schema,
    onSubmit: values => {
      const op = values.uid ? props.modify(values) : props.add(values);
      return op.then(success => success && props.setFormValues({} as any));
    }
  });

  const editingRow = (
    <TableRow>
      {props.columns.map(column => (
        <TableCell key={String(column.name)}>
          <TextField
            placeholder={column.placeholder}
            margin="dense"
            type={column.type}
            {...getTextFieldProps(formal, column.name)}
          />
        </TableCell>
      ))}
      <TableCell className={props.classes.actionCell}>
        <IconButton
          {...formal.getSubmitButtonProps()}
          type="submit"
          title="Save"
        >
          <DoneIcon />
        </IconButton>
        <IconButton
          onClick={() => props.setFormValues({} as any)}
          disabled={formal.isSubmitting}
          title="Cancel"
        >
          <ClearIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  return (
    <form {...formal.getFormProps()}>
      <Table>
        <TableHead>
          <TableRow>
            {props.columns.map(column => (
              <TableCell key={"" + column.name} style={{ width: column.width }}>
                {column.title}
              </TableCell>
            ))}
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {props.values.map(value => {
            return value.uid === props.formValues.uid ? (
              editingRow
            ) : (
              <TableRow key={value.uid}>
                {props.columns.map(column => (
                  <TableCell key={"" + column.name}>
                    {value[column.name]}
                  </TableCell>
                ))}
                <TableCell className={props.classes.actionCell}>
                  <IconButton
                    onClick={() =>
                      props.setFormValues({
                        ...props.initialFormValues,
                        ...value
                      })
                    }
                    title="Edit"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => props.delete(value.uid!)}
                    title="Delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
          {props.formValues.uid === "" && editingRow}
        </TableBody>
      </Table>
      <Fab
        color="secondary"
        className={props.classes.fab}
        title="New employee"
        onClick={() => props.setFormValues(props.initialFormValues)}
      >
        <AddIcon />
      </Fab>
    </form>
  );
};

/**
 * useStyles() that doesn't destroy the Generics is still alpha
 * Have to use some `any` casting below...
 */
const StyledAdminTable = withStyles(styles)(AdminTable);

const AdminListForm = <V extends { uid: string }>(props: AdminListProps<V>) => {
  const [formValues, setFormValues] = React.useState<V>({} as any);
  return (
    <StyledAdminTable
      key={String(formValues.uid)}
      formValues={formValues}
      setFormValues={setFormValues as any}
      {...props as any}
    />
  );
};

export default AdminListForm;
