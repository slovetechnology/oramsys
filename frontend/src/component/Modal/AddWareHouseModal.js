import Fade from '@material-ui/core/Fade';
import React, { useEffect, useState } from 'react'
import Backdrop from '@material-ui/core/Backdrop';
import Modal from '@material-ui/core/Modal';
import { Col, Row } from 'react-bootstrap';
import { FormControl, InputLabel, Select, TextField } from '@material-ui/core';
import { entityGetAction } from '../../redux/actions/entityAction';
import { useDispatch, useSelector } from 'react-redux';
import Autocomplete from "@material-ui/lab/Autocomplete";

const AddWareHouseModal = ({ onHide, show, wareHouseData, wareHouseId }) => {

    const dispatch = useDispatch()

    const [addWarehouse, setAddWarehouse] = useState({
        warehouseCompany: "",
        warehouse: ""
    })
    const [wareHouseCompanyOption, setWareHouseCompanyOption] = useState([])
    const [wareHouseOption, setWareHouseOption] = useState([])

    const entityData = useSelector(state => state.entityData.entity)

    useEffect(() => {
        dispatch(entityGetAction("Company"))
    }, [])

    useEffect(() => {
        let entityDetails = []
        if (entityData && entityData.data) {
            console.log('Entity DATA', entityData)

            entityData.data.map((ele) => {
                ele.roles.map(roleDetail => {
                    if (roleDetail.roleId?.roleName == "Warehouse Company") {
                        var temp = {
                            label: ele?.details?.name,
                            value: ele._id
                        }
                        entityDetails.push(temp)
                    } else {
                        var temp = {
                            label: ele?.details?.givenName,
                            value: ele._id
                        }
                    }
                })
            })
        }
        setWareHouseCompanyOption(entityDetails)
        // if (entityData && entityData.data) {
        //     setWareHouseCompanyOption(entityData.data.map((ele) => {
        //         if (ele?.details?.name) {
        //             return {
        //                 label: ele?.details?.name,
        //                 value: ele._id
        //             }
        //         } else { 
        //             return {
        //                 label: ele?.details?.givenName,
        //                 value: ele._id
        //             }
        //         }
        //     })) 
        // }
    }, [entityData])

    useEffect(() => {
        if (addWarehouse.warehouseCompany && entityData?.data) {
            let tempData = entityData.data.find((ele) => ele._id === addWarehouse.warehouseCompany.value)
            console.log("tempData==", tempData)
            setWareHouseOption(tempData?.warehouses?.map((item) => {
                return {
                    label: item.name,
                    value: item._id
                }
            }))
        }

        console.log('addWarehouse', addWarehouse);
    }, [addWarehouse.warehouseCompany])


    useEffect(() => {
        console.log('addWarehouse 22', addWarehouse);
    }, [addWarehouse])
    useEffect(() => {
        if (wareHouseId) {
            setAddWarehouse({
                warehouse: { value: wareHouseId?.warehouse?.value, label: wareHouseId?.warehouse?.label },
                warehouseCompany: { value: wareHouseId?.warehouseCompany?.value, label: wareHouseId?.warehouseCompany?.label },
            })
        }
    }, [wareHouseId])

    useEffect(() => {
        console.log('wareHouseId', wareHouseId)
    }, [wareHouseId])


    const save = () => {
        if (wareHouseId) {
            let id = wareHouseId?.tableData?.id
            wareHouseData(addWarehouse, id)
            onHide()
        } else {
            wareHouseData(addWarehouse)
            onHide()
        }
        // wareHouseData(addWarehouse)
        // onHide()
    }


    return (
        <>
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
                                <h2 id="transition-modal-title" className='modal-title'>Add Warehouse</h2>
                                <img src='../../assets/img/my-img/Close.png' onClick={() => onHide()} style={{ cursor: "pointer", width: "24px", height: "24px" }} />
                            </div>
                            <div className='add-edit-product p-0 mt-3' id="transition-modal-description" >
                                <div className='form'>
                                    <Row>
                                        <Col lg={6}>
                                            <Autocomplete
                                                options={wareHouseCompanyOption}
                                                getOptionLabel={(option) => option.label}
                                                id="disable-clearable"
                                                label="Warehouse company"
                                                renderInput={(params) => (
                                                    <TextField {...params} label="Warehouse company" variant="standard" />
                                                )}
                                                onChange={(event, newValue) => {


                                                    setAddWarehouse({ ...addWarehouse, warehouseCompany: newValue })
                                                }}
                                                value={(wareHouseCompanyOption && addWarehouse.warehouseCompany) && wareHouseCompanyOption.find((ele) => ele.value === addWarehouse.warehouseCompany?.value)}
                                                disableClearable
                                            />
                                        </Col>
                                        <Col lg={6}>
                                            <Autocomplete
                                                options={wareHouseOption}
                                                getOptionLabel={(option) => option.label}
                                                id="disable-clearable"
                                                label="Warehouse"
                                                renderInput={(params) => (
                                                    <TextField {...params} label="Warehouse" variant="standard" />
                                                )}
                                                onChange={(event, newValue) => {
                                                    console.log(newValue);
                                                    console.log('test 1  ', addWarehouse.warehouseCompany);
                                                    wareHouseOption.forEach((ele) => {
                                                        console.log(ele);
                                                    });
                                                    setAddWarehouse({ ...addWarehouse, warehouse: newValue })
                                                }}
                                                value={(wareHouseOption && addWarehouse.warehouse) && wareHouseOption.find((ele) => ele.value === addWarehouse.warehouse?.value)}
                                                disableClearable
                                            />
                                        </Col>
                                    </Row>
                                </div>
                                <div className='d-flex justify-content-between mt-4'>
                                    <button onClick={() => onHide()} className="footer_cancel_btn">cancel</button>
                                    <button onClick={() => { save() }} className='footer_next_btn'>{wareHouseId ? "Edit" : "Save"}</button>
                                </div>
                            </div>
                        </div>
                    </Fade>
                </Modal>
            </div>
        </>
    )
}

export default AddWareHouseModal    