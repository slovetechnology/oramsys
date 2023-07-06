import React, { useEffect, useState } from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import { Col, Row } from 'react-bootstrap';
import { toast } from 'react-toastify'
import { TextField } from '@material-ui/core';
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useDispatch, useSelector } from 'react-redux';
import { ratingAgenciesAction } from '../../redux/actions/ratingAgenciesAction';
import { companydataAction } from '../../redux/actions/companydataAction';
import { getRatingAgenciesById } from '../../redux/actions/entityAction';
import { useLocation } from 'react-router-dom';
import moment from 'moment';

const RatingModal = ({ onHide, show, mode, editData }) => {

    const dispatch = useDispatch()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const id = queryParams.get("id")

    const [agency, setAgency] = useState([])
    const [error, setError] = useState()
    const [rating, setRating] = useState({
        _id: "",
        agency: "",
        rating: "",
        dateOfRating: "",
        expiryDate: "",
    })

    const [agencyRatingOptions, setAgencyRatingOptions] = useState([])

    const agencyData = useSelector((state) => state.ratingAgenciesData.ratingAgencies)
    const companyData = useSelector((state) => state.companydata.companydata)

    useEffect(() => {
        dispatch(ratingAgenciesAction())
    }, [])

    useEffect(() => {
        if (rating.agency && agency) {
            setAgencyRatingOptions(agency.find((ele) => ele._id === rating.agency).ratingSchema)
        }
    }, [rating.agency, agency])

    useEffect(() => {
        console.log('editData', editData)
        if (mode === "Edit" || mode === "View" && companyData.ratings) {
            let temp = companyData.ratings.find((e, i) => i == editData)
            setRating({
                _id: temp?._id,
                agency: temp?.agency,
                rating: temp?.rating,
                dateOfRating: moment(temp.dateOfRating).format('YYYY-MM-DD'),
                expiryDate: moment(temp?.expiryDate).format('YYYY-MM-DD'),
            })
        }
    }, [editData, mode, companyData])

    useEffect(() => {
        if (agencyData && agencyData.status === 200) {
            setAgency(agencyData.data)
        }
    }, [agencyData])

    const validation = () => {
        let param = false
        let error = {}

        if (!rating.agency) {
            param = true
            error.agency = 'Please select agency'
        }

        if (!rating.rating) {
            param = true
            error.rating = 'Please select rating'
        }

        if (!rating.dateOfRating) {
            param = true
            error.dateOfRating = 'Please select date of rating'
        }

        if (!rating.expiryDate) {
            param = true
            error.expiryDate = 'Please select expiry date'
        }
        setError(error);
        return param
    }

    const saveData = () => {
        if (validation()) {
            return
        }
        const body = {
            ...companyData,
            ratings: companyData.ratings ? [...companyData.ratings, rating] : [rating]
        }
        dispatch(companydataAction(body))
        onHide()
    }

    const edit = () => {
        if (validation()) {
            return
        }
        const body = {
            ...companyData,
            ratings: companyData.ratings.map((ele, i) => i == editData ? rating : ele)
        }
        dispatch(companydataAction(body))
        onHide()
    }

    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className='model'
                open={show}
                onClose={onHide}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={show}>
                    <div className='modal-content'>
                        <div className='d-flex justify-content-between'>
                            <h2 id="transition-modal-title" className='modal-title'>{mode} Rating</h2>
                            <img src='../../assets/img/my-img/Close.png' onClick={() => onHide()} style={{ cursor: "pointer", width: "24px", height: "24px" }} />
                        </div>
                        <div className='add-edit-product p-0 mt-3' id="transition-modal-description" >
                            <div className='form'>
                                <Row>
                                    <Col lg={3} className="mb-4">
                                        <Autocomplete
                                            label="Agency"
                                            id="disable-clearable"
                                            onChange={(e, newVal) => setRating({ ...rating, agency: newVal._id })}
                                            getOptionLabel={(option) => option.name}
                                            options={agency}
                                            disableClearable
                                            renderInput={(params) => (
                                                <TextField {...params} label="Agency" variant="standard" />
                                            )}
                                            value={(agency.length && rating.agency) ? agency.find(item => item._id === rating?.agency) : {}}
                                            disabled={mode === "View"}
                                        />
                                        {error && error?.agency && <span style={{ color: "#da251e", width: "100%", textAlign: "start" }}>{error.agency}</span>}
                                    </Col>
                                    <Col lg={3} className="mb-4">
                                        <Autocomplete
                                            label="Rating"
                                            id="disable-clearable"
                                            onChange={(e, newVal) => setRating({ ...rating, rating: newVal._id })}
                                            getOptionLabel={(option) => option.grade}
                                            options={agencyRatingOptions}
                                            disableClearable
                                            renderInput={(params) => (
                                                <TextField {...params} label="Rating" variant="standard" />
                                            )}
                                            value={(agencyRatingOptions.length && rating.rating) ? agencyRatingOptions.find(item => item._id === rating?.rating) : {}}
                                            disabled={mode === "View"}
                                        />
                                        {error && error?.rating && <span style={{ color: "#da251e", width: "100%", textAlign: "start" }}>{error.rating}</span>}
                                    </Col>
                                    <Col xxl={3} className='mb-4'>
                                        <form className="" noValidate>
                                            <TextField
                                                id="date"
                                                label="Date of rating"
                                                type="date"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                name='date_rating'
                                                value={rating.dateOfRating}
                                                onChange={(e) => setRating({ ...rating, dateOfRating: e.target.value })}
                                                disabled={mode === "View"}
                                            />
                                        </form>
                                        {error && error?.dateOfRating && <span style={{ color: "#da251e", width: "100%", textAlign: "start" }}>{error.dateOfRating}</span>}
                                    </Col>
                                    <Col xxl={3} className='mb-4'>
                                        <form className="" noValidate>
                                            <TextField
                                                id="date"
                                                label="Expiry date"
                                                type="date"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                name='expiry_date'
                                                value={rating.expiryDate}
                                                onChange={(e) => setRating({ ...rating, expiryDate: e.target.value })}
                                                disabled={mode === "View"}
                                            />
                                        </form>
                                        {error && error?.expiryDate && <span style={{ color: "#da251e", width: "100%", textAlign: "start" }}>{error.expiryDate}</span>}
                                    </Col>
                                </Row>
                            </div>
                            <div className='d-flex justify-content-between mt-4'>
                                <button onClick={() => onHide()} className="footer_cancel_btn">cancel</button>
                                {mode !== "View" && <button onClick={() => { mode === "Edit" ? edit() : saveData() }} className='footer_next_btn'>{mode}</button>}
                            </div>
                        </div>
                    </div>
                </Fade>
            </Modal>
        </div>
    )
}

export default RatingModal