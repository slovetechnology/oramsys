import MaterialTable from 'material-table'
import React, { useEffect, useState } from 'react'
import RatingModal from '../../../../component/Modal/RatingModal'
import { useSelector, useDispatch } from 'react-redux';
import { companydataAction } from '../../../../redux/actions/companydataAction';
import { ratingAgenciesAction } from '../../../../redux/actions/ratingAgenciesAction';
import { useLocation } from 'react-router-dom';
import { TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete/Autocomplete';
import { Col, Row } from 'react-bootstrap';

const Ratings = ({ hendelNext, hendelCancel }) => {

    const dispatch = useDispatch()
    const [editModal, setEditModal] = useState(false)
    const [mode, setMode] = useState("")
    const [rating, setRating] = useState([])
    const [editData, setEditData] = useState('')
    const location = useLocation()
    const isView = location.state[1]?.isView
    const [rate, setRate] = useState({
        rateRequired: 'No'
    })

    const companyData = useSelector((state) => state.companydata.companydata)
    const agencyData = useSelector((state) => state.ratingAgenciesData.ratingAgencies)

    useEffect(() => {
        dispatch(ratingAgenciesAction())
    }, [ratingAgenciesAction])

    useEffect(() => {
        console.log(companyData, 'getting rate out')
        if (companyData && companyData.ratings && agencyData?.data) {
            setRating(companyData.ratings.map((ele) => {
                return {
                    agency: agencyData.data.find((item) => item._id === ele.agency)?.name,
                    rating: agencyData.data.find((item) => item._id === ele.agency)?.ratingSchema?.find((elem) => elem._id === ele.rating)?.grade,
                    dateOfRating: ele.dateOfRating,
                    expiryDate: ele.expiryDate,
                }
            }))
            setRate({
                rateRequired: companyData.isRating
            })
        }
    }, [companyData, agencyData])

    const Delete = (data) => {
        let body = {
            ...companyData,
            ratings: companyData.ratings.filter((e, i) => i !== data.tableData.id)
        }
        dispatch(companydataAction(body))
    }

    let ratingRequiredOptions = [
        { value: false, label: "No" },
        { value: true, label: "Yes" },
    ]

    return (
        <>
            <div className='ms-5'>
                <Row className='mt-4'>
                    <Col lg={6}>
                        <Autocomplete
                            label='Rating required?'
                            id='disable-clearable'
                            onChange={(e, newVal) => {
                                setRate({
                                    ...rate,
                                    rateRequired: newVal.label,
                                })
                                const body = {...companyData, isRating: newVal.label}
                                dispatch(companydataAction(body))
                            }
                            }
                            getOptionLabel={(option) => option.label || ""}
                            options={ratingRequiredOptions}
                            disableClearable
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label='Rate Required?'
                                    variant='standard'
                                />
                            )}
                            disabled={isView}
                            value={
                                ((ratingRequiredOptions.length > 0 &&
                                    rate.rateRequired === 'Yes') || rate.rateRequired === 'No') ?
                                    ratingRequiredOptions.find(
                                        (ele) => ele.label === rate.rateRequired
                                    ) : rate.rateRequired = ''
                            }
                        />
                    </Col>
                </Row>
            </div>
            <div className={`add-edit-product`}>
                <div className={`product ${rate.rateRequired === 'Yes' ? '' : 'd-none'}`}>
                    <div className='mb-3 d-flex justify-content-between align-items-center'>
                        <h2 className='m-0'>Ratings</h2>
                        <button className={`add_btn me-3 ${isView ? 'd-none' : 'd-block'}`} onClick={() => { setEditModal(true); setMode("Add") }}> <img src='../../assets/img/about/plus.png' className='me-2' />Add</button>
                    </div>
                    <MaterialTable
                        title=""
                        columns={[
                            { title: 'Agency', field: 'agency' },
                            { title: 'Rating', field: 'rating' },
                            { title: 'Date of rating', field: 'dateOfRating', type: "date" },
                            { title: 'Expiry date', field: 'expiryDate', type: "date" },
                        ]}
                        data={rating}
                        actions={isView ? [
                            {
                                icon: 'preview',
                                tooltip: 'View Rating',
                                onClick: (e, data) => { setEditModal(true); setMode("View"); setEditData(data.tableData.id) }
                            },
                        ] : [
                            {
                                icon: 'edit',
                                tooltip: 'Edit Rating',
                                onClick: (e, data) => { setEditModal(true); setMode("Edit"); setEditData(data.tableData.id) }
                            },
                            {
                                icon: 'preview',
                                tooltip: 'View Rating',
                                onClick: (e, data) => { setEditModal(true); setMode("View"); setEditData(data.tableData.id) }
                            },
                            {
                                icon: 'delete',
                                tooltip: 'Delete Rating',
                                onClick: (e, data) => { Delete(data) }
                            }
                        ]}
                        options={{
                            filtering: true,
                            actionsColumnIndex: -1,
                            sorting: true,
                            pageSize: 10,
                            search: false,
                        }}
                    />
                </div>
                <div className='footer_'>
                    <button onClick={() => { hendelCancel() }} className="footer_cancel_btn">cancel</button>
                    <button onClick={() => { rate.rateRequired === 'Yes' ? companyData?.ratings?.length > 0 && hendelNext() : rate.rateRequired === 'No' && hendelNext() }} className='footer_next_btn'> Next</button>
                </div>
            </div>
            {
                editModal && <RatingModal show={editModal} onHide={() => setEditModal(false)} mode={mode} editData={editData} />
            }
        </>
    )
}

export default Ratings