import { Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField, withStyles } from "@material-ui/core";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";
import * as actions from "../actions/dCandidate";
import useForm from "./useForm";

const styles = (theme) => ({
    root: {
        "& .MuiTextField-root": {
            margin: theme.spacing(1),
            minWidth: 230,
        },
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 230,
    },
    smMargin: {
        margin: theme.spacing(1),
    },
});

const initialFieldValues = {
    fullName: "",
    mobile: "",
    email: "",
    age: "",
    bloodGroup: "",
    address: "",
};

const DCandidateForm = ({ classes, ...props }) => {
    //toast msg.
    const { addToast } = useToasts();

    //validate()
    //validate({fullName:'jenny'})
    const validate = (fieldValues = values) => {
        let temp = { ...errors };
        if ("fullName" in fieldValues) temp.fullName = fieldValues.fullName ? "" : "Kolom ini perlu diisi.";
        if ("mobile" in fieldValues) temp.mobile = fieldValues.mobile ? "" : "Kolom ini perlu diisi.";
        if ("bloodGroup" in fieldValues) temp.bloodGroup = fieldValues.bloodGroup ? "" : "Kolom ini perlu diisi.";
        if ("email" in fieldValues) temp.email = /^$|.+@.+..+/.test(fieldValues.email) ? "" : "Email tidak valid.";
        setErrors({
            ...temp,
        });

        if (fieldValues == values) return Object.values(temp).every((x) => x == "");
    };

    const { values, setValues, errors, setErrors, handleInputChange, resetForm } = useForm(initialFieldValues, validate, props.setCurrentId);

    //material-ui select
    const inputLabel = React.useRef(null);
    const [labelWidth, setLabelWidth] = React.useState(0);
    React.useEffect(() => {
        setLabelWidth(inputLabel.current.offsetWidth);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            const onSuccess = () => {
                resetForm();
                addToast("Berhasil dikirimkan.", { appearance: "success" });
            };
            if (props.currentId == 0) props.createDCandidate(values, onSuccess);
            else props.updateDCandidate(props.currentId, values, onSuccess);
        }
    };

    useEffect(() => {
        if (props.currentId != 0) {
            setValues({
                ...props.dCandidateList.find((x) => x.id == props.currentId),
            });
            setErrors({});
        }
    }, [props.currentId]);

    return (
        <form autoComplete="off" noValidate className={classes.root} onSubmit={handleSubmit}>
            <Grid container>
                <Grid item xs={6}>
                    <TextField name="fullName" variant="outlined" label="Nama Lengkap" value={values.fullName} onChange={handleInputChange} {...(errors.fullName && { error: true, helperText: errors.fullName })} />
                    <TextField name="email" variant="outlined" label="Email" value={values.email} onChange={handleInputChange} {...(errors.email && { error: true, helperText: errors.email })} />
                    <FormControl variant="outlined" className={classes.formControl} {...(errors.bloodGroup && { error: true })}>
                        <InputLabel ref={inputLabel}>Golongan Darah</InputLabel>
                        <Select name="bloodGroup" value={values.bloodGroup} onChange={handleInputChange} labelWidth={labelWidth}>
                            <MenuItem value="">Pilih Golongan Darah</MenuItem>
                            <MenuItem value="A+">A+</MenuItem>
                            <MenuItem value="A-">A-</MenuItem>
                            <MenuItem value="B+">B+</MenuItem>
                            <MenuItem value="B-">B-</MenuItem>
                            <MenuItem value="AB+">AB+</MenuItem>
                            <MenuItem value="AB-">AB-</MenuItem>
                            <MenuItem value="O+">O+</MenuItem>
                            <MenuItem value="O-">O-</MenuItem>
                        </Select>
                        {errors.bloodGroup && <FormHelperText>{errors.bloodGroup}</FormHelperText>}
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <TextField name="mobile" variant="outlined" label="Telepon" value={values.mobile} onChange={handleInputChange} {...(errors.mobile && { error: true, helperText: errors.mobile })} />
                    <TextField name="age" variant="outlined" label="Umur" value={values.age} onChange={handleInputChange} />
                    <TextField name="address" variant="outlined" label="Alamat" value={values.address} onChange={handleInputChange} />
                    <div>
                        <Button variant="contained" color="primary" type="submit" className={classes.smMargin}>
                            Submit
                        </Button>
                        <Button variant="contained" className={classes.smMargin} onClick={resetForm}>
                            Reset
                        </Button>
                    </div>
                </Grid>
            </Grid>
        </form>
    );
};

const mapStateToProps = (state) => ({
    dCandidateList: state.dCandidate.list,
});

const mapActionToProps = {
    createDCandidate: actions.create,
    updateDCandidate: actions.update,
};

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(DCandidateForm));
