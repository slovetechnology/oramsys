import { TextField } from '@material-ui/core'
import MaterialTable from 'material-table'
import { DropzoneArea } from 'material-ui-dropzone'
import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import PartiesEditModal from '../../component/Modal/PartiesEditModal'
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useDispatch, useSelector } from 'react-redux';
import { CurrencyOptions } from "../../helper/common"
import { transactionDataAction } from '../../redux/actions/transactionDataAction'
import { MdOutlineDeleteOutline } from 'react-icons/md'
import { entityGetAction } from '../../redux/actions/entityAction'

const KeyParties = ({ hendelCancel, hendelNext, transactionType, getShippingCompany, getCounterParty, getWarehouseCompany, getLender, getBorrower }) => {
    console.log(getWarehouseCompany)
    console.log(getCounterParty)
    console.log(getShippingCompany)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [showEditModal, setShowEditModal] = useState(false)
    const [tableData, setTableData] = useState([])
    const [rowEditData, setRowEditData] = useState('')
    const [editId, setEditId] = useState('')
    const location = useLocation()
    const isView = location?.state[2]?.isView
    const [view, setView] = useState()
    const [borrower_Applicant, setBorrower_Applicant] = useState("")
    const [lenders, setLenders] = useState("")
    const [warehouseComp, setWarehouseComp] = useState("")
    const [counterPart, setCounterPart] = useState("")
    const [shippingComp, setShippingComp] = useState("")
    const [error, setError] = useState({})
    const [names, setNames] = useState([])
    const [buyers, setBuyer] = useState([])
    const nameOption = useSelector(state => state.entityData.entity)
    const [keyParties, setkeyParties] = useState([{
        'party_relation': '', 'buyer': '', 'shipper': '', 'upload_evidence': ''
    }])
    const [relatedPartyDetails, setRelatedPartyDetails] = useState([{
        'buyer': '', 'shipper': '', 'party_relation': '', 'upload_evidence': ''
    }])

    const [apiFetched, setApiFetched] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [relation, setRelation] = useState();

    const [warehouses, setWarehouses] = useState([])
    const [party, setParty] = useState({
        name: "",
        type: ""
    })
    const parties = [{
        label: 'Subsidiary',
        value: 'subsidiary',
        prefix: ''
    }, {
        label: 'Owners',
        value: 'owners',
        prefix: ''
    }, {
        label: 'Associate',
        value: 'associate',
        prefix: ''
    },
    {
        label: 'None',
        value: 'none',
        prefix: ''
    }
    ];
    const transactionData = useSelector((state) => state.transactionData.transactionData)
    const getTransactionByIdData = useSelector((state) => state.transactionData.getTransactionById)

    const handleRelatedParties = () => {
        let tempRelated = [...relatedPartyDetails, { 'buyer': '', 'shipper': '', 'party_relation': '', 'upload_evidence': '' }];
        console.log(tempRelated);
        setApiFetched(true);
        setRelatedPartyDetails(tempRelated)
    }
    const handleRemoveParty = (index) => {
        const list = [...relatedPartyDetails]
        list.splice(index, 1)
        setRelatedPartyDetails(list)
    }

    useEffect(() => {
        dispatch(entityGetAction('all'))
    }, []);

    useEffect(() => {
        // console.log('getTransactionByIdData.data?.keyparties',getTransactionByIdData.data?.keyParties[0].relatedParties);
        if (getTransactionByIdData && getTransactionByIdData.data) {
            setTableData(getTransactionByIdData.data.keyParties[0].parties.map((ele) => {
                console.log(ele);
                return {
                    name: { label: (ele.name?.details?.name != null ? ele.name?.details?.name : ele.name?.details?.givenName), value: ele.name?._id },
                    type: { label: ele.type?.roleName, value: ele.type?._id }
                }
            }))
            setApiFetched(true)
            setEditId(getTransactionByIdData?.data?.keyParties[0]?._id)
            setBorrower_Applicant(getLender.borrower_Applicant)
            setLenders(getBorrower.lenders)
            setWarehouseComp(getWarehouseCompany?.warehouses[0]?.warehouseCompany?.label)
            setCounterPart(getTransactionByIdData.data?.details?.pricingDetails
                ?.pricingCounterParty?.details.name)
            setShippingComp(getTransactionByIdData.data?.details?.shippingOptions
                ?.shippingCompany?.details.name)
            // setCounterPart(getCounterParty?.pricingCounterParty?.details?.name)
            // setShippingComp(getShippingCompany?.shippingCompany?.details?.name)
            // console.log('check warehouse', getTransactionByIdData.details.shippingOptions?.warehouses[0]?.warehouseCompany?.details.name)
            if (getTransactionByIdData.data?.keyParties[0].relatedParties != undefined && getTransactionByIdData.data?.keyParties[0].relatedParties.length > 0) {
                // console.log('keyparties at useEffect', keyParties);
                setkeyParties(getTransactionByIdData.data?.keyParties[0].relatedParties);

                console.log('relatedparties from database', getTransactionByIdData.data?.keyParties[0].relatedParties);
                setEditMode(true);
            }
            console.log('CUNTERPARTY', getCounterParty?.pricingCounterParty?.details?.name)
        }
    }, [getTransactionByIdData])

    useEffect(() => {
        if (getTransactionByIdData.data?.keyParties[0].relatedParties != undefined && getTransactionByIdData.data?.keyParties[0].relatedParties.length > 0) {
            console.log('RELATEDPARTIES FROM API', relatedPartyDetails);
            setRelatedPartyDetails(getTransactionByIdData.data?.keyParties[0].relatedParties);
        }
        // alert('getTransactionByIdData');
    }, [getTransactionByIdData])

    useEffect(() => {
        console.log('RELATEDPARTIES useeffect 2', relatedPartyDetails);
    }, [relatedPartyDetails])

    let temp = keyParties;
    const handleRelation = (e, newValue, ind) => {
        console.log('handleRelation event', e);

        console.log('handleRelation keyParties', keyParties);
        temp[ind].party_relation = newValue.value;
        console.log('handleRelation temp ----->', temp);
        setkeyParties(temp);

    }

    const handleParties = (e, newValue, ind, type) => {
        let temp = keyParties;
        let tempRelatedPartyDetails = relatedPartyDetails;
        if (temp[ind] == undefined) {
            temp = [...keyParties, {
                'party_relation': '', 'buyer': '', 'shipper': '', 'upload_evidence': ''
            }];
            tempRelatedPartyDetails = [...relatedPartyDetails, {
                'party_relation': '', 'buyer': '', 'shipper': '', 'upload_evidence': ''
            }];
        }
        var temp_name = (newValue.details?.name) ? newValue.details?.name : newValue.details?.givenName;
        if (type == "buyer") {
            if (temp[ind].shipper !== temp_name) {
                if (temp[ind] != undefined && temp[ind].buyer != undefined) {
                    temp[ind].buyer = temp_name;
                    tempRelatedPartyDetails[ind].buyer = temp_name;
                }
            } else {
                alert('Party 1 and Party 2 should not be identical');
            }
        } else {
            if (temp[ind].buyer !== temp_name) {
                temp[ind].shipper = temp_name;
                tempRelatedPartyDetails[ind].shipper = temp_name;

            } else {
                alert('Party 1 and Party 2 should not be identical');
            }
        }
        console.log('handleParties temp', temp);
        // setParty({ ...party, name: { value: newValue._id, label: temp_name } })
        setRelatedPartyDetails([...relatedPartyDetails]);
        setkeyParties(temp)
    }



    useEffect(() => {
        if (nameOption?.data) {
            // console.log(nameOption?.data);
            var temp_names = [];
            nameOption?.data.forEach((element, index) => {
                element.details.name = element.details?.name != null ? element.details?.name : element.details?.givenName;
                temp_names.push(element)
            });
            console.log("GET RELATED PARTIES DATA-----", temp_names);
            setNames(temp_names)
        }
    }, [nameOption])

    const partiesEditData = (data, id) => {
        if (id !== undefined) {
            setTableData(
                tableData.map((ele, i) => {
                    if (id === i) {
                        return data
                    } else {
                        return ele
                    }
                })
            )
            setRowEditData('')
        } else {
            setTableData([...tableData, data])
        }
    }
    const validation = () => {
        let flag = false
        let error = {}

        if (!relatedPartyDetails.buyer) {
            flag = true
            error.buyer = 'Please select a party'
        }
        if (!relatedPartyDetails.shipper) {
            flag = true
            error.shipper = 'Please select a party'
        }
        if (!relatedPartyDetails.party_relation) {
            flag = true
            error.party_relation = 'Please select a relation'
        }
        if (relatedPartyDetails.length < 1) {
            flag = true
            error.relatedPartyDetails = 'Please enter document remittance'
        }
        setError(error)
        return flag
    }


    const next = () => {
        // if (validation()) {
        //     return
        // }
        let relatedParties = keyParties;

        let body = {
            ...transactionData,
            keyParties: {
                _id: editId,
                keyParties: tableData.map((ele) => {
                    return {
                        type: ele.type,
                        name: ele.name
                    }
                }),
                relatedParties: relatedParties,
            },
            type: transactionType
        }
        dispatch(transactionDataAction(body))
        hendelNext()
    }

    useEffect(() => {
        let buyer_arr = [];
        let warehouses = [];
        if (names) {
            names.forEach(element => {
                element.roles.forEach(roleDetail => {
                    if (roleDetail.roleId?.roleName == "Buyer") {
                        var temp = {
                            label: element.details.name != null ? element.details.name : element.details.givenName,
                            value: element.details.name != null ? element.details.name : element.details.givenName,
                            prefix: ''
                        };
                        buyer_arr.push(temp);
                        element.warehouses.forEach(warehose => {
                            warehouses.push(warehose);
                        })
                    }
                });

            });
        }
        setBuyer(buyer_arr);
        setWarehouses(warehouses);
    }, [names])



    const handleBuyer = (e, newValue, ind) => {
        let temp = keyParties;
        temp[ind].buyer = newValue.label;
        setkeyParties(temp);
        console.log('handleBuyer keyParties', keyParties);

    }

    const handleShipper = (e, newValue, ind) => {
        var temp = keyParties;
        temp[ind].shipper = newValue.name;
        setkeyParties(temp);
        console.log('handleBuyer keyParties', keyParties);

    }

    const handleChangeFile = (file, ind) => {
        if (file) {
            new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            }).then((res) => {
                var temp = keyParties;
                temp[ind].upload_evidence = { type: 'img', name: file.name, file: res };
                setkeyParties(temp);
            });
            console.log('handleChangeFile keyparties', keyParties);
        }

    }

    const buyer_data_loop = [0];

    return (
        <>
            <div className='product'>
                <div className='mb-3 d-flex justify-content-between align-items-center'>
                    <h5 className="title-color">Parties</h5>
                    <button className={`add_btn me-3 ${isView ? 'd-none' : 'd-block'}`} onClick={() => { setShowEditModal(!showEditModal) }}> <img src='../../assets/img/about/plus.png' className='me-2' />Add</button>
                </div>
                <Row>
                    <Col lg={12} className="mb-4">
                        <TextField
                            label='Borrower/Applicant Name'
                            variant='standard'
                            color='warning'
                            name='borrower_Applicant'

                            // onChange={(e) => setBorrower_Applicant(e.target.value)}
                            value={getBorrower}
                            disabled={true}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col lg={12} className="mb-4">
                        <TextField
                            label='Lenders'
                            variant='standard'
                            color='warning'
                            name='lenders'

                            // onChange={(e) => setLenders(e.target.value)}
                            value={getLender}
                            disabled={true}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col lg={12} className="mb-4">
                        <TextField
                            label='Shipping Company'
                            variant='standard'
                            color='warning'
                            name='lenders'

                            // onChange={(e) => setLenders(e.target.value)}
                            value={shippingComp}
                            disabled={true}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col lg={12} className="mb-4">
                        <TextField
                            label='Warehouse Company'
                            variant='standard'
                            color='warning'
                            name='warehouse company'

                            // onChange={(e) => setBorrower_Applicant(e.target.value)}
                            value={warehouseComp}
                            disabled={true}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col lg={12} className="mb-4">
                        <TextField
                            label='Hedging Counterparty'
                            variant='standard'
                            color='warning'
                            name='Counterparty'

                            // onChange={(e) => setBorrower_Applicant(e.target.value)}
                            value={counterPart}
                            disabled={true}
                        />
                    </Col>
                </Row>


                <MaterialTable
                    title=""
                    columns={[
                        // {
                        //     title: 'Warehouse Company', render: rowData =>

                        // },
                        // {
                        //     title: 'Counterparty', render: rowData =>

                        // },
                        // {
                        //     title: 'Borrower/Applicant', render: rowData =>

                        // },
                        // {
                        //     title: 'Lender', render: rowData =>

                        // },
                        { title: 'Party', field: 'name.label' },
                        { title: 'Role', field: 'type.label' },

                    ]}
                    data={tableData}

                    actions={isView ? [{
                        icon: 'preview',
                        tooltip: 'View Product',
                        onClick: (event, rowData) => { setShowEditModal(!showEditModal); setRowEditData(rowData); setView(isView) }
                    }] : [
                        {
                            icon: 'edit',
                            tooltip: 'Edit Product',
                            onClick: (event, rowData) => { setRowEditData(rowData); setShowEditModal(!showEditModal); console.log('rowData ==', rowData) }
                        },
                        {
                            icon: 'preview',
                            tooltip: 'View Product',
                            onClick: (event, rowData) => { setShowEditModal(!showEditModal); setRowEditData(rowData) }
                        }
                    ]}
                    options={{
                        filtering: true,
                        actionsColumnIndex: -1,
                        sorting: true,
                        pageSize: 10,
                        search: false,
                        emptyRowsWhenPaging: false,
                    }}
                />
            </div>
            <div className='add-edit-product parties_main mb-4'>
                <div className='form' style={{ backgroundColor: "rgb(243, 243, 243)", border: "none" }}>
                    {/* <h5 className="title-color">Related parties</h5>
                    <button className={`add_btn me-3 ${isView ? 'd-none' : 'd-block'}`} onClick={() => { setShowEditModal(!showEditModal) }}> <img src='../../assets/img/about/plus.png' className='me-2' />Add</button> */}

                    <div className='mb-3 d-flex justify-content-between align-items-center'>
                        <h5 className="title-color">Related Parties</h5>
                        <button className={`add_btn me-3 ${isView ? 'd-none' : 'd-block'}`}
                            onClick={handleRelatedParties}>
                            <img src='../../assets/img/about/plus.png' className='me-2' />Add Party Relation</button>
                    </div>

                    <>
                        {apiFetched && relatedPartyDetails?.map((party, index) => (
                            <Row key={index}>
                                <>

                                    {/* <Col lg={3}>
                                            <div className='d-flex ms-4'>
                                                <img src='../../../assets/img/about/Tag.png' style={{ "height": "30px", "top": "22px", "position": "relative" }} />
                                                <Autocomplete
                                                    className='ms-3 mb-3 w-100'
                                                    options={names}
                                                    getOptionLabel={(option) => option.label || ""}
                                                    id={"disable-clearable-buyer" + ind}
                                                    label="Buyer"
                                                    renderInput={(params) => (
                                                        <TextField {...params} label="Party 1" variant="standard" />
                                                    )}
                                                    defaultValue={relatedParties.buyer}
                                                    getOptionSelected={(option) => option.label === 'test'}
                                                    onChange={(event, newValue) => handleBuyer(event, newValue, ind)}
                                                    disableClearable
                                                />
                                            </div>
                                        </Col> */}
                                    <Col lg={3}>
                                        <Autocomplete
                                            options={names}
                                            getOptionLabel={(option) => (option.details?.name)}
                                            id={"disable-clearable-buyer-" + index}
                                            label="Party"
                                            renderInput={(params) => (
                                                <TextField {...params} label="Party 1" variant="standard" />
                                            )}
                                            onChange={(event, newValue) => {
                                                console.log('test1');
                                                // names.forEach((ele) => { 
                                                //     console.log(ele.details.name);
                                                //     console.log('hurre',party.buyer==ele.details.name);
                                                console.log(party.buyer);
                                                // })
                                                // console.log(names.find((ele) => ele.details.name == party.buyer))

                                                handleParties(event, newValue, index, 'buyer');
                                            }}
                                            disabled={isView}
                                            value={names.find((ele) => ele.details.name === party.buyer)}
                                            disableClearable
                                        />
                                        {error && error?.buyer && <span style={{ color: 'red' }}>{error?.buyer}</span>}
                                    </Col>

                                    <Col lg={3}>
                                        <Autocomplete
                                            options={names}
                                            getOptionLabel={(option) => (option.details?.name)}
                                            id={"disable-clearable-shipper-" + index}
                                            label="Party"
                                            renderInput={(params) => (
                                                <TextField {...params} label="Party 2" variant="standard" />
                                            )}
                                            onChange={(event, newValue) => {
                                                handleParties(event, newValue, index, 'shipper');
                                            }}
                                            disabled={isView}
                                            value={(names && party.shipper) && names.find((ele) => ele.details.name === party.shipper)}
                                            disableClearable
                                        />
                                        {error && error?.shipper && <span style={{ color: 'red' }}>{error?.shipper}</span>}
                                    </Col>

                                    {/* {warehouses.map((element) => ( */}

                                    {/* <Col lg={3}>
                                            <><div className='d-flex'>
                                                <img src='../../../assets/img/about/Deliver.png' style={{ "height": "30px", "top": "22px", "position": "relative" }} />
                                                <Autocomplete
                                                    className='ms-3 mb-3 w-100'
                                                    options={warehouses}
                                                    getOptionLabel={(option) => option.name}
                                                    id={"disable-clearable-shipper-" + ind}
                                                    label="Shipper"
                                                    renderInput={(params) => (
                                                        <TextField {...params} label="Party 2" variant="standard" />
                                                    )}
                                                    defaultValue={relatedParties.shipper}
                                                    getOptionSelected={(option) => option.name === 'test'}
                                                    onChange={(event, newValue) => handleShipper(event, newValue, ind)}
                                                    disableClearable
                                                />
                                            </div></>
                                                        

                                        </Col> */}
                                    <Col lg={4}>
                                        <div className='d-flex align-items-center Related_parties'>
                                            <p className='mb-0 title-color'>Relation</p>
                                            <Autocomplete
                                                className='ms-3 mb-3'
                                                options={[...parties]}
                                                getOptionLabel={(option) => option.label}
                                                id={"disable-clearable-relation-party-" + party.party_relation}
                                                label="Party Relation"
                                                renderInput={(params) => (
                                                    <TextField {...params} label="Party Relation " variant="standard" />
                                                )}
                                                defaultValue={relatedPartyDetails.party_relation}
                                                getOptionSelected={(option) => option.label === 'test'}
                                                onChange={(event, newValue) => { handleRelation(event, newValue, index); setRelation(parties); console.log('parties', parties); console.log('party', party); }}
                                                value={parties.find((ele) => ele.value == party.party_relation)}
                                                disableClearable
                                            />
                                        </div>
                                        {error && error?.party_relation && <span style={{ color: 'red' }}>{error?.party_relation}</span>}
                                    </Col>
                                    {relation && <Col lg={2}>
                                        <div className='drag-and-drop'>
                                            <DropzoneArea
                                                Icon="none"
                                                filesLimit={1}
                                                showPreviews={true}
                                                // defaultValue={relatedPartyDetails.upload_evidence}
                                                showPreviewsInDropzone={false}
                                                useChipsForPreview
                                                previewGridProps={{ container: { spacing: 1, } }}
                                                dropzoneText='Upload Evidence'
                                                dropzoneProps={
                                                    { disabled: false }
                                                }
                                                previewText=""
                                                onChange={(file) => handleChangeFile(file[0], index)}
                                                disabled={party.buyer === '' || party.shipper === '' || party.party_relation === ''}
                                            />
                                        </div>
                                        {error && error?.upload_evidence && <span style={{ color: 'red' }}>{error?.upload_evidence}</span>}
                                    </Col>}

                                    {/* <Col lg={2}>
                                        <div className=''>
                                    <MdOutlineDeleteOutline onClick={() => handleRemoveParty(index)} className='cursor-pointer' size={30} />
                                    </div> 
                                        </Col> */}

                                </>
                                {/* <div className='d-flex justify-content-end '>
                                    <MdOutlineDeleteOutline className='mb-5' size={30} />
                                    </div> */}
                            </Row>
                        ))}
                    </>




                </div>
            </div>
            <div className='footer_'>
                <button onClick={() => { transactionType === "Export" ? hendelCancel() : navigate('/transactions') }} className="footer_cancel_btn">cancel</button>
                <button onClick={() => { tableData.length > 0 && next() }} className='footer_next_btn'> Next</button>
            </div>

            {showEditModal && <PartiesEditModal show={showEditModal} onHide={() => { setShowEditModal(false); setRowEditData('') }} getModalData={(e, id) => partiesEditData(e, id)} editData={rowEditData} isView={view} />}
        </>
    )
}

export default KeyParties
