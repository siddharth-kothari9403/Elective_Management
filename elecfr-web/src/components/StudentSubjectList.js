import React, {useState} from "react";
import { useEffect } from "react";
import RequestListItem from "../common/RequestListItem";
import { getSubjectFromStorage, getStudentFromStorage, getInstructorFromStorage} from "../services/localStorage_services";
import {getSubjectStudents, getSubjectStudentsByStudentId, getSubjectStudentByInstructorId, getSubjectStudentsBySubjectCode, getForInstructorAndStudent} from "../services/user_services"

const StudentSubjectList = ({choice}) => {
    const [requests, setRequests] = useState([]);
    var subject = null;
    var student = null;
    var instructor = null;

    const getRequests = async() => {
        if (choice === 1){
            const list = await getSubjectStudents();
            setRequests(list);
        }else if (choice === 2){
            subject = getSubjectFromStorage();
            const list = await getSubjectStudentsBySubjectCode(subject.subjectCode);
            setRequests(list);
        }else if (choice === 3){
            student = getStudentFromStorage();
            const list = await getSubjectStudentsByStudentId(student.id);
            setRequests(list);
        }else if (choice === 4){
            instructor = getInstructorFromStorage();
            const list = await getSubjectStudentByInstructorId(instructor.id);
            setRequests(list);
        }else if (choice === 5){
            instructor = getInstructorFromStorage();
            student = getStudentFromStorage();
            const list = await getForInstructorAndStudent(student);
            setRequests(list)
        }
    }

    useEffect(() => {
        getRequests();
    }, [])

    return (
    <>
        { (requests.length === 0) ? <div className='container'>
            <header className='jumbotron'> 
                Nothing to show
            </header>
        </div>
            : null
        }
        <ul id="remove">
            {requests.map((data) => (
                <li id="space" key= {data.slno}><RequestListItem request={data}/></li>
            ))}
        </ul>
    </>
    )
}

export default StudentSubjectList;