import MaterialTable from 'material-table'
import { InputAdornment, TextField } from "@material-ui/core"
import React, { useEffect, useState } from 'react'
import LicencesEditModal from '../../../../component/Modal/LicencesEditModal'
import { useSelector, useDispatch } from 'react-redux'
import { companydataAction } from '../../../../redux/actions/companydataAction'
import moment from 'moment';
import { Col, Row } from "react-bootstrap"
import Autocomplete from "@material-ui/lab/Autocomplete"

import { useLocation } from 'react-router-dom'

const Licences = ({ hendelNext, hendelCancel }) => {

    const [editModal, setEditModal] = useState(false)
    const [mode, setMode] = useState("")
    const dispatch = useDispatch()
    const [licenceTable, setLicenceTable] = useState([])
    const [editData, setEditData] = useState('')
    const location = useLocation()
    const isView = location.state[1]?.isView
    const [licence, setLicence] = useState({
        warehouseRequired: ''
      })

    const companyData = useSelector((state) => state.companydata.companydata)
    const countryData = useSelector((state) => state.countryData.country)

    useEffect(() => {
        if (companyData && companyData.licenses && countryData?.data) {
            setLicenceTable(companyData.licenses.map((ele) => {
                return {
                    type: ele.type,
                    number: ele.number,
                    authority: ele.authority,
                    country: countryData.data.find((item) => item._id === ele.country)?.name,
                    dateofrating: moment(ele.dateOfRating).format("YYYY-MM-DD"),
                    expirydate: moment(ele.expiryDate).format("YYYY-MM-DD"),
                }
            }))
            setLicence(companyData.licenses.map((ele) => {
                return {
                    warehouseRequired: ele.warehouseRequired
                }
            }))
        }
    }, [companyData, countryData])

    let warehouseRequiredOptions = [
        { value: '', label: "Select option" },
        { value: true, label: "Yes" },
        { value: false, label: "No" },
    ]

    const Delete = (data) => {
        let body = {
            ...companyData,
            licenses: companyData.licenses.filter((ele, i) => i !== data.tableData.id)
        }
        dispatch(companydataAction(body))
    }

    return (
        <>
            <div className='add-edit-product'>
                <div className='product'>
                    <div>
                    <Row className='mt-4'>
                                   
                                    <Col lg={6}>
                                        <Autocomplete
                                            label='Warehouse required?'
                                            id='disable-clearable'
                                            onChange={(e, newVal) =>
                                                setLicence({
                                                    ...licence,
                                                    warehouseRequired: newVal.value,
                                                })
                                            }
                                            getOptionLabel={(option) => option.label || ""}
                                            options={warehouseRequiredOptions}
                                            disableClearable
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label='Warehouse Required?'
                                                    variant='standard'
                                                />
                                            )}
                                            disabled={isView}
                                            value={
                                                ((warehouseRequiredOptions.length > 0 &&
                                                    licence.warehouseRequired === true) ||
                                                    licence.warehouseRequired === false) ?
                                                    warehouseRequiredOptions.find(
                                                        (ele) => ele.value === licence.warehouseRequired
                                                    ) : warehouseRequiredOptions = ''
                                            }
                                        />
                                        {/* {error?.warehouseRequired && (
                                            <span
                                                style={{
                                                    color: "#da251e",
                                                    width: "100%",
                                                    textAlign: "start",
                                                }}
                                            >
                                                {error?.warehouseRequired}
                                            </span>
                                        )} */}
                                    </Col>
                                </Row>
                    </div>
                    {licence.warehouseRequired && (
                        <>
                         <div className='mb-3 d-flex justify-content-between align-items-center'>
                        <h2 className='m-0'>Licences</h2>
                        <button className={`add_btn me-3 ${isView ? 'd-none' : 'd-block'}`} onClick={() => { setEditModal(true); setMode("Add") }}> <img src='../../assets/img/about/plus.png' className='me-2' />Add</button>
                    </div>
                    <MaterialTable
                        title=""
                        columns={[
                            { title: 'Type', field: 'type' },
                            { title: 'Number', field: 'number' },
                            { title: 'Authority', field: 'authority' },
                            { title: 'Country', field: 'country' },
                            { title: 'Date Of Rating', field: 'dateofrating' },
                            { title: 'Expiry Date', field: 'expirydate' },
                        ]}
                        data={licenceTable}
                        actions={isView ? [{
                            icon: 'preview',
                            tooltip: 'View Licences',
                            onClick: (e, data) => { setEditModal(true); setEditData(data.tableData.id); setMode("View") }
                        },] : [
                            {
                                icon: 'edit',
                                tooltip: 'Edit Licences',
                                onClick: (e, data) => { setEditModal(true); setEditData(data.tableData.id); setMode("Edit") }
                            },
                            {
                                icon: 'preview',
                                tooltip: 'View Licences',
                                onClick: (e, data) => { setEditModal(true); setEditData(data.tableData.id); setMode("View") }
                            },
                            {
                                icon: 'delete',
                                tooltip: 'Delete Licences',
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
                        </>
                    )}
                   
                </div>
                <div className='footer_'>
                    <button onClick={() => { hendelCancel() }} className="footer_cancel_btn">cancel</button>
                    <button onClick={() => { companyData?.licenses?.length > 0 && hendelNext() }} className='footer_next_btn'> Next</button>
                </div>
            </div>
            {
                editModal && <LicencesEditModal show={editModal} onHide={() => { setEditModal(false); setEditData(''); setMode('') }} mode={mode} editData={editData} />
            }
        </>
    )
}

export default Licences