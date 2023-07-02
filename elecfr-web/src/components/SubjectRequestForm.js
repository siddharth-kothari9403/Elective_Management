import React, { useState} from "react";
import { useNavigate } from "react-router-dom";

import Dialog from "@mui/material/Dialog";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { RequestSubjectValidator } from "../validators/SubjectRequestValidator";
import { getSubjectFromStorage, getStudentFromStorage, } from "../services/localStorage_services";
import { registerRequest } from "../services/user_services";

const SubjectRequestForm = () => {

    const [open, setOpen] = React.useState(false);

    const [form, setForm] = useState({
        startDate:"",
        endDate:""
    });

    const [subject, setSubject] = useState(() => {
        const temp = getSubjectFromStorage();
        return temp;
    })

    const [student, setStudent] = useState(() => {
        const temp = getStudentFromStorage();
        return temp;
    })

    const navigate = useNavigate();
    const [message, setMessage] = useState("");

    const {errors, validateForm} = RequestSubjectValidator(form);

    const handleClickToOpen = () => {
        setOpen(true);
    };
 
    const handleToClose = () => {
        setOpen(false);
        navigate("/subjects")
    };

    const onUpdateField = e => {
        const nextFormState = {
          ...form,
          [e.target.name]: e.target.value,
        };
        setForm(nextFormState);
    };

    const onSubmitForm = e => {
        setMessage("")
        e.preventDefault();    
        const { isValid } = validateForm({ form, errors, forceTouchErrors: true });
        if (!isValid) return;
        registerRequest(student,subject,form.startDate,form.endDate).then(
            response => {
                handleClickToOpen()
            },
            error => {
                const resMessage = (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                  error.message ||
                  error.toString();
                setMessage(resMessage)
            }
        )
    };

    return (

        <div className="col-md-12">
            <div className="card card-container">
            <img
                src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                alt="profile-img"
                className="profile-img-card"
            />

            <form onSubmit={onSubmitForm}>
                
                <div className="form-group">
                    <label htmlFor="startDate">startDate</label>
                    <input
                        type="date"
                        className="form-control"
                        name="startDate"
                        aria-label="startDate"
                        value={form.startDate}
                        onChange={onUpdateField}
                    />

                    {errors.startDate.dirty && errors.startDate.error ? (
                            <div className="alert alert-danger" role="alert">{errors.username.message}</div>
                            ) : null}
                    </div>

                    <div className="form-group">
                        <label htmlFor="endDate">End Date</label>
                        <input
                            type="date"
                            className="form-control"
                            name="endDate"
                            aria-label="endDate"
                            value={form.endDate}
                            onChange={onUpdateField}
                        />

                        {errors.endDate.dirty && errors.endDate.error ? (
                            <div className="alert alert-danger" role="alert">{errors.password.message}</div>
                            ) : null}
                    </div>

                    <div className="form-group">
                        <button className="btn btn-primary btn-block">Request Subject</button>
                    </div>

                    {message ? 
                        <div className="alert alert-danger" role="alert">{message}</div>
                        : null}
                </form>
            </div>

            <Dialog open={open} onClose={handleToClose}>
                <DialogTitle>{"Request Subject"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        We have received your request, kindly wait till the Instructor approves it.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <button onClick={handleToClose}
                        color="primary" autoFocus>
                        Go to Subjects list
                    </button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default SubjectRequestForm;