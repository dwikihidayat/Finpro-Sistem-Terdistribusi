import { Button, ButtonGroup, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, withStyles } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";
import * as actions from "../actions/dCandidate";
import DCandidateForm from "./DCandidateForm";

const styles = (theme) => ({
    root: {
        "& .MuiTableCell-head": {
            fontSize: "1.25rem",
            backgroundColor: "#CF5656", // Add background color for table head
        },
    },
    paper: {
        margin: theme.spacing(2),
        padding: theme.spacing(2),
        backgroundColor: "#ECF6F7", // Add background color for Paper
    },
    tableContainer: {
        maxHeight: 270, // Adjust the height as needed
        overflowY: "auto",
    },
});

const DCandidates = ({ classes, ...props }) => {
    const [currentId, setCurrentId] = useState(0);

    useEffect(() => {
        props.fetchAllDCandidates();
    }, []); //componentDidMount

    //toast msg.
    const { addToast } = useToasts();

    const onDelete = (id) => {
        if (window.confirm("Yakin ingin menghapus?")) props.deleteDCandidate(id, () => addToast("Berhasil Dihapus", { appearance: "info" }));
    };
    return (
        <Paper className={classes.paper} elevation={3}>
            <Grid container>
                <Grid item xs={6}>
                    <DCandidateForm {...{ currentId, setCurrentId }} />
                </Grid>
                <Grid item xs={6}>
                    <TableContainer className={classes.tableContainer}>
                        <Table stickyHeader>
                            <TableHead className={classes.root}>
                                <TableRow>
                                    <TableCell>Nama</TableCell>
                                    <TableCell>Telepon</TableCell>
                                    <TableCell>Golongan Darah</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {props.dCandidateList.map((record, index) => {
                                    return (
                                        <TableRow key={index} hover>
                                            <TableCell>{record.fullName}</TableCell>
                                            <TableCell>{record.mobile}</TableCell>
                                            <TableCell>{record.bloodGroup}</TableCell>
                                            <TableCell>
                                                <ButtonGroup variant="text">
                                                    <Button>
                                                        <EditIcon
                                                            color="primary"
                                                            onClick={() => {
                                                                setCurrentId(record.id);
                                                            }}
                                                        />
                                                    </Button>
                                                    <Button>
                                                        <DeleteIcon color="secondary" onClick={() => onDelete(record.id)} />
                                                    </Button>
                                                </ButtonGroup>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </Paper>
    );
};

const mapStateToProps = (state) => ({
    dCandidateList: state.dCandidate.list,
});

const mapActionToProps = {
    fetchAllDCandidates: actions.fetchAll,
    deleteDCandidate: actions.Delete,
};

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(DCandidates));
