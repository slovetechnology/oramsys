import { InputAdornment, TextField } from "@material-ui/core"
import React, { useEffect, useState } from "react"
import { Col, Row } from "react-bootstrap"
import { useLocation, useNavigate } from "react-router-dom"
import AddWareHouseModal from "../../component/Modal/AddWareHouseModal"
import AddInsuranceModal from "../../component/Modal/AddInsuranceModal"
import MaterialTable from "material-table"
import { useDispatch, useSelector } from "react-redux"
import { productGetAction } from "../../redux/actions/productAction"
import TextEditerModal from "../../component/Modal/TextEditerModal"
import { countrieAction } from "../../redux/actions/countrieAction"
import Autocomplete from "@material-ui/lab/Autocomplete"
import { CurrencyOptions } from "../../helper/common"
import { formatCurrency } from "../../helper/utils"
import { entityGetAction } from "../../redux/actions/entityAction"
import { transactionDataAction } from "../../redux/actions/transactionDataAction"
import moment from "moment"
import { airPortsAction, portsAction } from "../../redux/actions/portsAction"
import LoadingSpinner from "../../component/LoadingSpinner";
import { ApiGet, ApiPost } from '../../helper/API/ApiData';

const DetailsTransaction = ({ hendelNext, onHide, show, transactionType, signalCounterParty, signalWarehouseCompany, signalContract, signalBorrower, signalLender, transaction_id }) => {
    const navigate = useNavigate()

    // let numberReg = /^[0-9\b]+$/;
    const [isLoading, setIsLoading] = useState(true);
    const [productDetails, setProductDetails] = useState({
        nature: "",
        type: "",
        commodityType: "",
        commoditySubType: "",
        name: "",
        quantity: "",
        metric: "",
        quality: "",
    })

    const [contractDetails, setContractDetails] = useState({
        currency: "",
        value: "",
        contractDate: "",
        expiryDate: "",
        conditionsOfContract: "",
        descriptionOfContract: "",
    })

    const [shippingOptions, setShippingOptions] = useState({
        countryOfOrigin: "",
        portOfOrigin: "",
        airbaseOfOrigin: "",
        shipmentDate: "",
        shipmentMode: "",
        shipmentTerms: "",
        shippedWeights: "",
        destinationCountry: "",
        destinationPort: "",
        destinationAirbase: "",
        shipmentFrequency: "",
        warehouseRequired: "",
        warehouses: [],
        shippingCompany: "",
    })

    const [transShipmentOptions, setTransShipmentOptions] = useState({
        tranShipmentRequired: "",
        street: "",
        city: "",
        country: "",
        transShipmentQuantity: "",
        transShipmentDate: "",
    })

    const [pricingDetails, setPricingDetails] = useState({
        pricingType: "",
        pricingAmount: "",
        pricingUnit: "",
        previousDayClosingAmount: "",
        pricingFormula: "",
        pricingHedgeingStatus: false,
        pricingHedgingMethod: "",
        pricingCounterParty: "",
    })

    const [borrower_Applicant, setBorrower_Applicant] = useState("")
    const [lenders, setLenders] = useState("")

    const [addWarehouseModal, setAddWarehouseModal] = useState(false)
    const [addInsuranceModal, setAddInsuranceModal] = useState(false)
    const location = useLocation()
    const productType = location?.state[1]?.type
    const isView = location.state[2]?.isView
    const dispatch = useDispatch()
    const [productName, setProductName] = useState([])
    const [showTextEditModal, setShowTextEditModal] = useState(false)
    const [type, setType] = useState("")
    const [selectedName, setSelectedName] = useState("")
    const [countries, setcountries] = useState([])
    const [sendModalData, setSendModalData] = useState("")
    const [counterPartyOption, setCounterPartyOption] = useState([])
    const [shippingCompanyOption, setShippingCompanyOption] = useState([])
    const [borrowerOption, setBorrowerOption] = useState([])
    const [lenderOption, setLenderOption] = useState([])
    const [wareHouseId, setWareHouseId] = useState("")
    const [error, setError] = useState({})
    const [selectedProduct, setSelectedProduct] = useState("")
    const [editId, setEditId] = useState("")
    const [portsOptions, setPortsOptions] = useState([])
    const [originCountry, setOriginCountry] = useState([])
    // const [airPort, setAirPort] = useState([])

    const productData = useSelector((state) => state.product.product)
    const country = useSelector((state) => state.countryData.country)
    const entityData = useSelector((state) => state.entityData.entity)
    // const getTransactionByIdData = useSelector(
    //     (state) => state.transactionData.getTransactionById
    // )
    const ports = useSelector((state) => state.ports.port)
    const airBase = useSelector((state) => state.airPorts.airPort)
    const [activeOnChange, setActiveOnChange] = useState('');
    const [apiCalled, setApiCalled] = useState(true);
    useEffect(() => {
        dispatch(productGetAction("all"))
        dispatch(countrieAction("all"))
        dispatch(entityGetAction("Company"))
    }, [])

    useEffect(() => {
        if (
            shippingOptions.shipmentMode === "SEA" &&
            countries.length > 0 &&
            ports?.data &&
            ports.data.length > 0
        ) {
            if (shippingOptions.countryOfOrigin) {
                let tempData = countries.find(
                    (el) => el?._id === shippingOptions.countryOfOrigin
                )?.name
                ports.data[0].country === tempData && setOriginCountry(ports.data)
            }
            if (shippingOptions.destinationCountry) {
                let tempData = countries.find(
                    (el) => el?._id === shippingOptions.destinationCountry
                )?.name
                ports.data[0].country === tempData && setPortsOptions(ports.data)
            }
        } else if (
            shippingOptions.shipmentMode === "AIR" &&
            countries.length > 0 &&
            airBase?.data &&
            airBase.data.length > 0
        ) {
            if (shippingOptions.countryOfOrigin) {
                let tempData = countries.find(
                    (el) => el?._id === shippingOptions.countryOfOrigin
                )?.name
                airBase.data[0].country === tempData && setOriginCountry(airBase.data)
            }
            if (shippingOptions.destinationCountry) {
                let tempData = countries.find(
                    (el) => el?._id === shippingOptions.destinationCountry
                )?.name
                airBase.data[0].country === tempData && setPortsOptions(airBase.data)
            }
        }
    }, [ports, airBase, countries, shippingOptions])

    useEffect(() => {
        console.log('=======airBase', airBase.data)
    }, [airBase])

    useEffect(() => {
        console.log('=======portsOptions', portsOptions)
    }, [portsOptions])

    const setPorts = (country) => {

        console.log('setPorts shippingOptions.shipmentMode', shippingOptions.shipmentMode);
        if (shippingOptions.shipmentMode === "SEA") {
            dispatch(portsAction(country))
        } else if (shippingOptions.shipmentMode === "AIR") {
            dispatch(airPortsAction(country))
        }
        setActiveOnChange('origin')
        // setApiCalled(false)
    }

    const setDestinationPorts = (country) => {
        if (shippingOptions.shipmentMode === "SEA") {
            dispatch(portsAction(country))
        } else if (shippingOptions.shipmentMode === "AIR") {
            dispatch(airPortsAction(country))
        }
        setActiveOnChange('destination')
        // setApiCalled(false)
    }

    useEffect(() => {
        if (shippingOptions.countryOfOrigin) {
            setPorts(
                countries.find((item) => item._id === shippingOptions.countryOfOrigin)
                    ?.name
            )
        }
        if (shippingOptions.destinationCountry) {
            setPorts(
                countries.find(
                    (item) => item._id === shippingOptions.destinationCountry
                )?.name
            )
        }
    }, [shippingOptions.countryOfOrigin, shippingOptions.destinationCountry])


    useEffect(() => {

        console.log('active on change', activeOnChange);
        // if (
        //     shippingOptions.shipmentMode === "SEA" &&
        //     countries.length > 0 &&
        //     ports?.data &&
        //     ports.data.length > 0
        // ) {

        //     if (shippingOptions.destinationCountry && activeOnChange == 'destination') {
        //         setPortsOptions([])
        //         let tempData = countries.find(
        //             (el) => el?._id === shippingOptions.destinationCountry
        //         )?.name
        //         ports.data[0].country === tempData && setPortsOptions(ports.data)
        //     }
        // } else if (
        //     shippingOptions.shipmentMode === "AIR" &&
        //     countries.length > 0 &&
        //     airBase?.data &&
        //     airBase.data.length > 0
        // ) {

        //     if (shippingOptions.destinationCountry && activeOnChange == 'destination') {
        //         setPortsOptions([])
        //         let tempData = countries.find(
        //             (el) => el?._id === shippingOptions.destinationCountry
        //         )?.name
        //         console.log('---set port optoin-----', airBase.data)
        //         airBase.data[0].country === tempData && setPortsOptions(airBase.data)
        //     }
        // }
    }, [activeOnChange])

    useEffect(() => {
        let entityDetails = []
        if (entityData && entityData.data) {
            console.log('Entity DATA', entityData)

            entityData.data.map((ele) => {
                ele.roles.map(roleDetail => {
                    if (roleDetail.roleId?.roleName == "Hedge Counterparty") {
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
        setCounterPartyOption(entityDetails)
        console.log("TAG HEDGE COUNTERPARTY", counterPartyOption)
    }, [entityData])

    useEffect(() => {
        let shipDetails = []
        if (entityData && entityData.data) {

            entityData.data.map((ele) => {
                ele.roles.map(roleDetail => {
                    if (roleDetail.roleId?.roleName == "Shipping Company") {
                        var temp = {
                            label: ele?.details?.name,
                            value: ele._id
                        }
                        shipDetails.push(temp)
                    } else {
                        var temp = {
                            label: ele?.details?.givenName,
                            value: ele._id
                        }
                    }
                })
            })
        }
        setShippingCompanyOption(shipDetails)
        console.log("TAG WAREHOUSE", shippingCompanyOption)
    }, [entityData])

    useEffect(() => {
        let getBuyer = []
        if (entityData && entityData.data) {

            entityData.data.map((ele) => {
                ele.roles.map(roleDetail => {
                    if (roleDetail.roleId?.roleName == "Buyer" || roleDetail.roleId?.roleName == "Seller") {
                        var temp1 = {
                            label: ele?.details?.name,
                            value: ele._id
                        }
                        getBuyer.push(temp1)
                    } else {
                        var temp1 = {
                            label: ele?.details?.givenName,
                            value: ele._id
                        }
                    }
                })
            })
        }
        setBorrowerOption(getBuyer)
        console.log("TAG BORROWER", borrowerOption)
    }, [entityData])

    useEffect(() => {
        let bankRole = []
        if (entityData && entityData.data) {

            entityData.data.map((ele) => {
                ele.roles.map(roleDetail => {
                    if (roleDetail.roleId?.roleName == "Bank") {
                        var temp = {
                            label: ele?.details?.name,
                            value: ele._id
                        }
                        bankRole.push(temp)
                    } else {
                        var temp = {
                            label: ele?.details?.givenName,
                            value: ele._id
                        }
                    }
                })
            })
        }
        setLenderOption(bankRole)
        console.log("TAG LENDER", lenderOption)
    }, [entityData])



    useEffect(() => {
        if (productType === "Physical") {
            setProductDetails({ ...productDetails, nature: "Physical" })
        } else {
            setProductDetails({ ...productDetails, nature: "Non-Physical" })
        }
    }, [productType])



    useEffect(() => {
        if (productName.length > 0 && productDetails.name) {
            setProductDetails({
                ...productDetails,
                metric: productName.find((ele) => ele._id === productDetails.name)?.matric,
            })
        }
    }, [productDetails.name, productName])

    useEffect(() => {
        if (country && country.data) {
            setcountries(country.data)
        }
    }, [country])

    useEffect(() => {
        transactionDetail(transaction_id);
    }, [transaction_id])


    let transactionDetail = async (id) => {
        if (id) {
            await ApiGet(`transaction/getById/${id}`)
                .then((getTransactionByIdData) => {
                    let resp = getTransactionByIdData.data;
                    let respProductDetails = getTransactionByIdData.data.details.productDetails;
                    console.log('CHECK ALL DATA', getTransactionByIdData.data)

                    if (getTransactionByIdData && getTransactionByIdData.data) {
                        setEditId(getTransactionByIdData.data?.details?._id)
                        setBorrower_Applicant(getTransactionByIdData.data?.borrower_Applicant)
                        setLenders(getTransactionByIdData.data?.lenders)
                        setProductDetails({
                            nature: respProductDetails?.nature,
                            type: respProductDetails?.type,
                            commodityType:
                                respProductDetails?.commodityType,
                            commoditySubType:
                                respProductDetails
                                    ?.commoditySubType,
                            name: respProductDetails?.name?._id,
                            quantity:
                                respProductDetails?.quantity,
                            metric: respProductDetails?.metric,

                            quality: getTransactionByIdData.data?.details?.productDetails?.quality,
                        })
                        // setProductDetails({
                        //      commoditySubType: getTransactionByIdData.data?.details?.productDetails
                        //         ?.commoditySubType
                        // })

                        setContractDetails({
                            currency:
                                getTransactionByIdData.data?.details?.contractDetails?.currency,
                            value: getTransactionByIdData.data?.details?.contractDetails?.value,
                            contractDate:
                                getTransactionByIdData.data?.details?.contractDetails?.contractDate &&
                                moment(
                                    getTransactionByIdData.data?.details?.contractDetails?.contractDate
                                ).format("YYYY-MM-DD"),
                            expiryDate:
                                getTransactionByIdData.data?.details?.contractDetails?.expiryDate &&
                                moment(
                                    getTransactionByIdData.data?.details?.contractDetails?.expiryDate
                                ).format("YYYY-MM-DD"),
                            conditionsOfContract:
                                getTransactionByIdData.data?.details?.contractDetails
                                    ?.conditionsOfContract,
                            descriptionOfContract:
                                getTransactionByIdData.data?.details?.contractDetails
                                    ?.descriptionOfContract,
                        })

                        setShippingOptions({
                            shipmentDate:
                                getTransactionByIdData.data?.details?.shippingOptions?.shipmentDate &&
                                moment(
                                    getTransactionByIdData.data?.details?.shippingOptions?.shipmentDate
                                ).format("YYYY-MM-DD"),
                            shipmentMode:
                                getTransactionByIdData.data?.details?.shippingOptions?.shipmentMode,
                            shipmentTerms:
                                getTransactionByIdData.data?.details?.shippingOptions?.shipmentTerms,
                            shippedWeights:
                                getTransactionByIdData.data?.details?.shippingOptions?.shippedWeights.toLocaleString(),
                            countryOfOrigin:
                                getTransactionByIdData.data?.details?.shippingOptions?.countryOfOrigin
                                    ?._id,
                            portOfOrigin:
                                getTransactionByIdData.data?.details?.shippingOptions?.portOfOrigin
                                    ?._id,
                            airbaseOfOrigin:
                                getTransactionByIdData.data?.details?.shippingOptions?.airbaseOfOrigin
                                    ?._id,
                            destinationCountry:
                                getTransactionByIdData.data?.details?.shippingOptions
                                    ?.destinationCountry?._id,
                            destinationPort:
                                getTransactionByIdData.data?.details?.shippingOptions?.destinationPort
                                    ?._id,
                            destinationAirbase:
                                getTransactionByIdData.data?.details?.shippingOptions
                                    ?.destinationAirbase?._id,
                            shipmentFrequency:
                                getTransactionByIdData.data?.details?.shippingOptions
                                    ?.shipmentFrequency,
                            warehouseRequired:
                                getTransactionByIdData.data?.details?.shippingOptions
                                    ?.warehouseRequired,
                            shippingCompany: getTransactionByIdData.data?.details?.shippingOptions
                                ?.shippingCompany,
                            warehouses:
                                getTransactionByIdData.data?.details?.shippingOptions?.warehouses.map(
                                    (item) => {
                                        return {
                                            warehouse: {
                                                value: item?.warehouse?._id,
                                                label: item?.warehouse?.name,
                                            },
                                            warehouseCompany: {
                                                value: item?.warehouseCompany?._id,
                                                label: item?.warehouseCompany?.details?.name,
                                            },
                                        }
                                    }
                                ),

                        })

                        setTransShipmentOptions({
                            tranShipmentRequired:
                                getTransactionByIdData.data?.details?.transShipmentOptions
                                    ?.tranShipmentRequired,
                            street:
                                getTransactionByIdData.data?.details?.transShipmentOptions?.street,
                            city: getTransactionByIdData.data?.details?.transShipmentOptions?.city,
                            country:
                                getTransactionByIdData.data?.details?.transShipmentOptions?.country
                                    ?._id,
                            transShipmentQuantity:
                                getTransactionByIdData.data?.details?.transShipmentOptions
                                    ?.transShipmentQuantity,
                            transShipmentDate:
                                getTransactionByIdData.data?.details?.transShipmentOptions
                                    ?.transShipmentDate &&
                                moment(
                                    getTransactionByIdData.data?.details?.transShipmentOptions
                                        ?.transShipmentDate
                                ).format("YYYY-MM-DD"),
                        })

                        setPricingDetails({
                            pricingType:
                                getTransactionByIdData.data?.details?.pricingDetails?.pricingType,
                            pricingAmount:
                                getTransactionByIdData.data?.details?.pricingDetails?.pricingAmount.toLocaleString(),
                            pricingUnit:
                                getTransactionByIdData.data?.details?.pricingDetails?.pricingUnit,
                            previousDayClosingAmount:
                                getTransactionByIdData.data?.details?.pricingDetails
                                    ?.previousDayClosingAmount,
                            pricingFormula:
                                getTransactionByIdData.data?.details?.pricingDetails?.pricingFormula,
                            pricingHedgeingStatus:
                                getTransactionByIdData.data?.details?.pricingDetails
                                    ?.pricingHedgingStatus,
                            pricingHedgingMethod:
                                getTransactionByIdData.data?.details?.pricingDetails
                                    ?.pricingHedgingMethod,
                            pricingCounterParty:
                                getTransactionByIdData.data?.details?.pricingDetails
                                    ?.pricingCounterParty?._id,
                        })

                        if (respProductDetails.commoditySubType != undefined) {
                            let product = [];
                            productData.data.forEach((item) => {
                                // if (item.commodity_sub_type == respProductDetails.commoditySubType) {
                                //     product.push(item);
                                // }
                                if (item.category == respProductDetails.commodityType) {
                                    product.push(item);
                                }
                            })
                            setProductName(product);
                        } else {
                            if (productData && productData.data) {
                                setProductName(productData.data)
                            }
                        }
                        setIsLoading(false);
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
        }
    }

    useEffect(() => {

        if (productDetails.commoditySubType != undefined) {
            let product = [];
            productData.data.forEach((item) => {
                console.log('item', item);
                console.log('productDetails', productDetails);
                // if (item.commodity_sub_type == productDetails.commoditySubType) {
                //     product.push(item);
                // }
                if (item.category == productDetails.commodityType) {
                    product.push(item);
                }
            })
            setProductName(product);
        } else {
            if (productData && productData.data) {
                setProductName(productData.data)
            }
        }
    }, [productData])

    const hadleChangeModal = (e) => {
        setContractDetails({ ...contractDetails, [e.name]: e.value })
    }

    let options = [
        { label: "Select option", value: "" },
        { label: "Yes", value: true },
        { label: "No", value: false },
    ]

    const productTypesOption = ["Commodity"]

    const commodityTypeOption = ["Hard", "Energy", "Soft"]

    const commoditySubTypeOption =
        productDetails.commodityType === "Hard"
            ? ["Metal"]
            : productDetails.commodityType === "Energy"
                ? ["Energy"]
                : productDetails.commodityType === "Soft"
                    ? ["Agricultural"]
                    : []

    const metricOption = ["Ton"]

    const productQualityOption = ["Exchange traded", "Non Exchange traded"]

    const shipmentModeOptions = ["AIR", "LAND", "SEA"]

    const portOfOriginOptions = ["Mumbai", "Chennai", "Kolkata", "Cochin"]

    const shipmentTermsOptions = [
        "Free on Board  (FOB)",
        "Cost Insurance and Freight (CIF)",
        "Cost and Freight (CFR)",
        "Free Alongside Ship (FAS)",
    ]

    const shipmentFrequencyOptions = [
        "Not Applicable",
        "One-Off",
        "Daily",
        "Weekly",
        "Monthly",
        "Quaterly",
        "Bi-Annually",
        "Yearly",
    ]

    const hedgingMethodOption = [
        "Futures",
        "Options",
        "SWAPS",
        "Forwards",
        "Other",
    ]

    const portData = [
        "RAS AL KHAIMAH",
        "RUWAIS",
        "SHARJAH",
        "ZURKU ISLAND",
        "BOST",
        "CHAKCHARAN",
        "DARWAZ",
    ]

    let warehouseRequiredOptions = [
        { value: '', label: "Select option" },
        { value: true, label: "Yes" },
        { value: false, label: "No" },
    ]

    const pricingTypeOption = ["Firm fixed price", "Price to be fixed"]

    const pricingFormulaOption = [
        "To be negotiated",
        "Reference to Exchange Price",
        "Other",
    ]

    const handleChnage = (e, name, type) => {
        if (type === "productDetails") {
            if (name === "quantity") {
                if (e.target.value === '' || e.target.value) {
                    setProductDetails({ ...productDetails, [name]: e.target.value })
                }
            }
        }
        else if (type === "contractDetails") {
            if (name === "value") {
                if (e.target.value === '' || e.target.value) {
                    setContractDetails({ ...contractDetails, [name]: e.target.value })
                }
            }
        }
        else if (type === "shippingOptions") {
            if (name === "shippedWeights") {
                if (e.target.value === '' || e.target.value) {
                    setShippingOptions({ ...shippingOptions, [name]: e.target.value })
                }
            }
        }
        else if (type === "transShipmentOptions") {
            if (name === "transShipmentQuantity") {
                if (e.target.value === '' || e.target.value) {
                    setTransShipmentOptions({ ...transShipmentOptions, [name]: e.target.value })

                }
            }
        }
        else if (type === "pricingDetails") {
            if (name === "pricingAmount" || name === "previousDayClosingAmount") {
                if (e.target.value === '' || e.target.value) {
                    setPricingDetails({ ...pricingDetails, [name]: e.target.value })
                }
            }
        }
    }

    const handleChnages = (e) => {
        setContractDetails({
            ...contractDetails,
            [e.target.name]: e.target.value,
        })
    }

    const formateCurrencyValue = (data) => {
        if (data) {
            let value = data.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            // let prefix = CurrencyOptions.find((ele) => ele.label === contractDetails?.currency)?.prefix
            // let suffix = CurrencyOptions.find((ele) => ele.label === contractDetails?.currency)?.suffix
            // return prefix ? (prefix + value) : suffix ? (value + suffix) : value
            return value
        } else {
            return data
        }
    }

    const validation = () => {
        let flag = false
        let error = {}

        if (!borrower_Applicant) {
            flag = true
            error.borrower_Applicant = "Please enter borrower applicant name!"
        }
        if (!lenders) {
            flag = true
            error.lenders = "Please enter lenders!"
        }
        if (!productDetails.name) {
            flag = true
            error.name = "Please enter product name!"
        }

        if (!productDetails.type) {
            flag = true
            error.type = "Please enter type!"
        }

        if (!productDetails.commodityType) {
            flag = true
            error.commodityType = "Please enter commodity type!"
        }

        if (!productDetails.commoditySubType) {
            flag = true
            error.commoditySubType = "Please enter commodity sub type!"
        }

        if (!productDetails.quantity) {
            flag = true
            error.quantity = "Please enter product quantity!"
        }

        if (!productDetails.metric) {
            flag = true
            error.metric = "Please enter metric!"
        }

        if (!productDetails.quality) {
            flag = true
            error.quality = "Please enter product Quality!"
        }

        if (!contractDetails.currency) {
            flag = true
            error.currency = "Please enter contract currency!"
        }

        if (!contractDetails.value) {
            flag = true
            error.value = "Please enter contract value!"
        }

        if (!contractDetails.contractDate) {
            flag = true
            error.contractDate = "Please enter contract date!"
        }

        if (!contractDetails.expiryDate) {
            flag = true
            error.expiryDate = "Please enter expiry date!"
        }

        if (!contractDetails.conditionsOfContract) {
            flag = true
            error.conditionsOfContract = "Please enter conditions of contract!"
        }

        if (!contractDetails.descriptionOfContract) {
            flag = true
            error.descriptionOfContract = "Please enter sescription of contract!"
        }

        if (!shippingOptions.countryOfOrigin) {
            flag = true
            error.countryOfOrigin = "Please enter country of Origin!"
        }

        if (shippingOptions.shipmentMode === "SEA") {
            if (!shippingOptions.portOfOrigin) {
                flag = true
                error.portOfOrigin = "Please enter port of origin!"
            }
        } else if (shippingOptions.shipmentMode === "AIR") {
            if (!shippingOptions.airbaseOfOrigin) {
                flag = true
                error.portOfOrigin = "Please enter port of origin!"
            }
        }

        if (!shippingOptions.shipmentDate) {
            flag = true
            error.shipmentDate = "Please enter shipment date!"
        }

        if (!shippingOptions.shipmentMode) {
            flag = true
            error.shipmentMode = "Please enter shipment mode!"
        }

        if (!shippingOptions.shipmentTerms) {
            flag = true
            error.shipmentTerms = "Please enter shipment terms!"
        }

        if (!shippingOptions.shippedWeights) {
            flag = true
            error.shippedWeights = "Please enter proipped weights!"
        }

        if (!shippingOptions.destinationCountry) {
            flag = true
            error.destinationCountry = "Please enter destination country!"
        }

        if (shippingOptions.shipmentMode === "SEA") {
            if (!shippingOptions.destinationPort) {
                flag = true
                error.destinationPort = "Please enter destination port!"
            }
        } else if (shippingOptions.shipmentMode === "AIR") {
            if (!shippingOptions.destinationAirbase) {
                flag = true
                error.destinationPort = "Please enter destination port!"
            }
        }

        if (!shippingOptions.shipmentFrequency) {
            flag = true
            error.shipmentFrequency = "Please enter shipment frequency!"
        }

        if (shippingOptions.warehouseRequired === "") {
            flag = true
            error.warehouseRequired = "Please enter warehouse required!"
        }

        if (transShipmentOptions.tranShipmentRequired === "") {
            flag = true
            error.tranShipmentRequired = "Please enter transhipment required!"
        }

        if (
            transShipmentOptions.tranShipmentRequired &&
            !transShipmentOptions.street
        ) {
            flag = true
            error.street = "Please enter street!"
        }

        if (
            transShipmentOptions.tranShipmentRequired &&
            !transShipmentOptions.city
        ) {
            flag = true
            error.city = "Please enter city!"
        }

        if (
            transShipmentOptions.tranShipmentRequired &&
            !transShipmentOptions.country
        ) {
            flag = true
            error.country = "Please select country!"
        }

        if (
            transShipmentOptions.tranShipmentRequired &&
            !transShipmentOptions.transShipmentQuantity
        ) {
            flag = true
            error.transShipmentQuantity = "Please enter transshipment quantity (kg)!"
        }

        if (
            transShipmentOptions.tranShipmentRequired &&
            !transShipmentOptions.transShipmentDate
        ) {
            flag = true
            error.transShipmentDate = "Please enter transhipment date!"
        }

        if (!pricingDetails.pricingType) {
            flag = true
            error.pricingType = "Please enter pricing type!"
        }

        if (
            pricingDetails.pricingType === "Firm fixed price" &&
            !pricingDetails.pricingAmount
        ) {
            flag = true
            error.pricingAmount = "Please enter pricing amount!"
        }

        if (
            pricingDetails.pricingType === "Firm fixed price" &&
            !pricingDetails.previousDayClosingAmount
        ) {
            flag = true
            error.previousDayClosingAmount =
                "Please enter previous_day_closing_amount!"
        }

        if (
            pricingDetails.pricingType === "Price to be fixed" &&
            !pricingDetails.pricingFormula
        ) {
            flag = true
            error.pricingFormula = "Please enter pricing formula!"
        }

        if (
            pricingDetails.pricingType === "Price to be fixed" &&
            pricingDetails.pricingHedgeingStatus === ""
        ) {
            flag = true
            error.pricingHedgeingStatus = "Please enter pricing hedgeing status!"
        }

        if (
            pricingDetails.pricingHedgeingStatus &&
            !pricingDetails.pricingHedgingMethod
        ) {
            flag = true
            error.pricingHedgingMethod = "Please enter hedgeing method!"
        }

        if (
            pricingDetails.pricingHedgeingStatus &&
            !pricingDetails.pricingCounterParty
        ) {
            flag = true
            error.pricingCounterParty = "Please enter counter party!"
        }
        if (!shippingOptions.shippingCompany) {
            flag = true
            error.shippingCompany = "Please enter a shipping company!"
        }
        setError(error)
        return flag
    }

    const warehouseData = (data, id) => {
        if (id !== undefined) {
            setShippingOptions({
                ...shippingOptions,
                warehouses: shippingOptions.warehouses.map((ele, i) => {
                    if (i === id) {
                        return data
                    } else {
                        return ele
                    }
                }),
            })
            setWareHouseId("")
        } else {
            setShippingOptions({
                ...shippingOptions,
                warehouses: [...shippingOptions.warehouses, data],
            })
        }
    }



    const next = () => {
        if (validation()) {
            return
        }
        if (!transShipmentOptions.tranShipmentRequired) {
            delete transShipmentOptions.city
            delete transShipmentOptions.country
            delete transShipmentOptions.street
            delete transShipmentOptions.transShipmentDate
            delete transShipmentOptions.transShipmentQuantity
        }
        if (shippingOptions.shipmentMode === "SEA") {
            delete shippingOptions.airbaseOfOrigin
            delete shippingOptions.destinationAirbase
        } else if (shippingOptions.shipmentMode === "AIR") {
            delete shippingOptions.destinationPort
            delete shippingOptions.portOfOrigin
        }
        let body = {
            details: {
                _id: editId,
                productDetails,
                contractDetails,
                shippingOptions,
                transShipmentOptions,
                pricingDetails,
            },
            borrower_Applicant,
            lenders,
            type: transactionType,
        }
        dispatch(transactionDataAction(body))
        signalContract(body.details.contractDetails)
        signalBorrower(body.borrower_Applicant)
        // signalWarehouseCompany(body.details.shippingOptions)
        // signalCounterParty(body.details.pricingDetails)
        signalLender(body.lenders)
        hendelNext()
    }

    const handleCommoditySubtypeChange = (e, newVal) => {
        // let product = [];
        // productData.data.forEach((item) => {
        // if (item.commodity_sub_type == newVal) {
        //     product.push(item);
        // }
        // })
        // setProductName(product);
        setProductDetails({
            ...productDetails,
            commoditySubType: newVal,
        })
    }

    const handleCommodityTypeChange = (e, newVal) => {
        let product = [];
        productData.data.forEach((item) => {
            if (item.category == newVal) {
                product.push(item);
            }
        })
        setProductName(product);
        setProductDetails({
            ...productDetails,
            commodityType: newVal,
        })
    }

    return (
        <>
            {isLoading && productDetails.length > 0 ? <LoadingSpinner /> :
                <>
                    <div className='add-edit-product'>
                        <div className='form'>
                            <Row>
                            <Col lg={6}>
                                    <Autocomplete
                                        label='Borrower/Applicant'
                                        id='disable-clearable'
                                        onChange={(e, newVal) => {
                                            setBorrower_Applicant(newVal.label)
                                        }}
                                        getOptionLabel={(option) => option.label || ""}
                                        options={borrowerOption}
                                        disableClearable
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label='Borrower/Applicant'
                                                variant='standard'
                                            />
                                        )}
                                        disabled={isView}
                                        value={
                                            borrowerOption.length > 0 &&
                                            borrower_Applicant !==
                                            undefined &&
                                            borrower_Applicant &&
                                            borrowerOption.find(
                                                (ele) =>
                                                    ele.label ===
                                                    borrower_Applicant
                                            )
                                        }
                                    />
                                    {error?.pricingCounterParty && (
                                        <span
                                            style={{
                                                color: "#da251e",
                                                width: "100%",
                                                textAlign: "start",
                                            }}
                                        >
                                            {error?.pricingCounterParty}
                                        </span>
                                    )}
                                </Col>

                                <Col lg={6}>
                                    <Autocomplete
                                        label='Lender'
                                        id='disable-clearable'
                                        onChange={(e, newVal) =>
                                            setLenders(newVal.label)
                                        }
                                        getOptionLabel={(option) => option.label || ""}
                                        options={lenderOption}
                                        disableClearable
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label='Lender'
                                                variant='standard'
                                            />
                                        )}
                                        disabled={isView}
                                        value={
                                            lenderOption.length > 0 &&
                                            lenders !==
                                            undefined &&
                                            lenders &&
                                            lenderOption.find(
                                                (ele) =>
                                                    ele.label ===
                                                    lenders
                                            )
                                        }
                                    />
                                    {error?.pricingCounterParty && (
                                        <span
                                            style={{
                                                color: "#da251e",
                                                width: "100%",
                                                textAlign: "start",
                                            }}
                                        >
                                            {error?.pricingCounterParty}
                                        </span>
                                    )}
                                </Col>
                            </Row>
                            {/* <Row>
                                <Col lg={6}>
                                    <TextField
                                        label='Borrower/Applicant Name'
                                        variant='standard'
                                        color='warning'
                                        name='borrower_Applicant'
                                        className='mb-3'
                                        onChange={(e) => setBorrower_Applicant(e.target.value)}
                                        value={borrower_Applicant}
                                        disabled={isView}
                                    />
                                    {error && error?.borrower_Applicant && (
                                        <span
                                            style={{
                                                color: "#da251e",
                                                width: "100%",
                                                textAlign: "start",
                                            }}
                                        >
                                            {error.borrower_Applicant}
                                        </span>
                                    )}
                                </Col>
                                <Col lg={6}>
                                    <TextField
                                        label='Lenders'
                                        variant='standard'
                                        color='warning'
                                        name='Lenders'
                                        className='mb-3'
                                        onChange={(e) => setLenders(e.target.value)}
                                        value={lenders}
                                        disabled={isView}
                                    />
                                    {error && error?.lenders && (
                                        <span
                                            style={{
                                                color: "#da251e",
                                                width: "100%",
                                                textAlign: "start",
                                            }}
                                        >
                                            {error.lenders}
                                        </span>
                                    )}
                                </Col>
                            </Row> */}
                        </div>
                    </div>
                    <div className='add-edit-product'>
                        <div
                            className='form'
                            style={{ backgroundColor: "rgb(243, 243, 243)", border: "none" }}
                        >
                            <h2 className='mb-3'>Product Details</h2>
                            <div>
                                <Row>
                                    <Col lg={3}>
                                        <TextField
                                            label='Product Nature'
                                            variant='standard'
                                            color='warning'
                                            name='Product_nature'
                                            className='mb-3'
                                            value={productDetails.nature}
                                            disabled={true}
                                        />
                                    </Col>
                                    <Col
                                        lg={3}
                                        className={
                                            productType === "Non-Physical" ? "d-none" : "d-block"
                                        }
                                    >
                                        <Autocomplete
                                            label='Product Type'
                                            id='disable-clearable'
                                            onChange={(e, newVal) =>
                                                setProductDetails({ ...productDetails, type: newVal })
                                            }
                                            getOptionLabel={(option) => option}
                                            options={productTypesOption ?? []}
                                            disableClearable
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label='Product Type'
                                                    variant='standard'
                                                />
                                            )}
                                            value={
                                                productTypesOption &&
                                                productDetails?.type &&
                                                productTypesOption.find(
                                                    (ele) => ele === productDetails.type
                                                )
                                            }
                                            disabled={isView}
                                        />
                                        {error && error?.type && (
                                            <span
                                                style={{
                                                    color: "#da251e",
                                                    width: "100%",
                                                    textAlign: "start",
                                                }}
                                            >
                                                {error.type}
                                            </span>
                                        )}
                                    </Col>
                                    <Col
                                        lg={3}
                                        className={
                                            productType === "Non-Physical"
                                                ? "d-none"
                                                : productDetails.type
                                                    ? "d-block"
                                                    : "d-none"
                                        }
                                    >
                                        <Autocomplete
                                            label='Commodity Type'
                                            id='disable-clearable'
                                            onChange={(e, newVal) =>

                                                handleCommodityTypeChange(e, newVal)
                                            }
                                            getOptionLabel={(option) => option || ""}
                                            options={commodityTypeOption}
                                            disableClearable
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label='Commodity Type'
                                                    variant='standard'
                                                />
                                            )}
                                            value={
                                                commodityTypeOption.length > 0 &&
                                                productDetails?.commodityType &&
                                                commodityTypeOption.find(
                                                    (ele) => ele === productDetails.commodityType
                                                )
                                            }
                                            disabled={isView}
                                        />
                                        {error?.commodityType && (
                                            <span
                                                style={{
                                                    color: "#da251e",
                                                    width: "100%",
                                                    textAlign: "start",
                                                }}
                                            >
                                                {error?.commodityType}
                                            </span>
                                        )}
                                    </Col>
                                    <Col
                                        lg={3}
                                        className={
                                            productType === "Non-Physical"
                                                ? "d-none"
                                                : productDetails.type
                                                    ? "d-block"
                                                    : "d-none"
                                        }
                                    >
                                        <Autocomplete
                                            label='Commodity Sub-Type'
                                            id='disable-clearable'
                                            onChange={(e, newVal) =>
                                                handleCommoditySubtypeChange(e, newVal)
                                            }
                                            getOptionLabel={(option) => option || ""}
                                            options={commoditySubTypeOption}
                                            disableClearable
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label='Commodity Sub-Type'
                                                    variant='standard'
                                                />
                                            )}
                                            value={
                                                commoditySubTypeOption.length > 0 &&
                                                productDetails?.commoditySubType &&
                                                commoditySubTypeOption.find(
                                                    (ele) => ele === productDetails.commoditySubType
                                                )
                                            }
                                            disabled={isView}
                                        />
                                        {error?.commoditySubType && (
                                            <span
                                                style={{
                                                    color: "#da251e",
                                                    width: "100%",
                                                    textAlign: "start",
                                                }}
                                            >
                                                {error?.commoditySubType}
                                            </span>
                                        )}
                                    </Col>
                                    <Col lg={3} className='mb-3'>
                                        <Autocomplete
                                            label='Product Name'
                                            id='disable-clearable'
                                            onChange={(e, newVal) => {
                                                setProductDetails({ ...productDetails, name: newVal._id })
                                                setSelectedProduct(newVal?.unit ? newVal.unit : "")
                                            }}
                                            getOptionLabel={(option) => option.name || ""}
                                            options={productName}
                                            disableClearable
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label='Product Name'
                                                    variant='standard'
                                                />
                                            )}
                                            disabled={isView}
                                            value={
                                                productName.length > 0 &&
                                                productDetails.name &&
                                                productName.find((ele) => ele._id === productDetails.name)
                                            }
                                        />
                                        {error?.name && (
                                            <span
                                                style={{
                                                    color: "#da251e",
                                                    width: "100%",
                                                    textAlign: "start",
                                                }}
                                            >
                                                {error?.name}
                                            </span>
                                        )}
                                    </Col>
                                    <Col lg={3} className='mb-3'>
                                        <TextField
                                            label='Product Quantity'
                                            variant='standard'
                                            color='warning'
                                            name='Product_nature'
                                            value={formateCurrencyValue(productDetails.quantity)}
                                            onChange={(e) =>
                                                handleChnage(e, "quantity", "productDetails")
                                            }
                                            disabled={isView}
                                        />
                                        {error?.quantity && (
                                            <span
                                                style={{
                                                    color: "#da251e",
                                                    width: "100%",
                                                    textAlign: "start",
                                                }}
                                            >
                                                {error?.quantity}
                                            </span>
                                        )}
                                    </Col>
                                    <Col lg={3} className='mb-3'>

                                        <TextField
                                            label='Product Unit'
                                            variant='standard'
                                            color='warning'
                                            name='netMetric'
                                            value={productDetails.metric}
                                            onChange={(e) => handleChnage(e, "metric", "productDetails")}
                                            disabled={true}
                                        />
                                        {error?.metric && (
                                            <span
                                                style={{
                                                    color: "#da251e",
                                                    width: "100%",
                                                    textAlign: "start",
                                                }}
                                            >
                                                {error?.metric}
                                            </span>
                                        )}
                                    </Col>
                                    <Col lg={productDetails.type ? 3 : 6} className='mb-3'>
                                        <Autocomplete
                                            label='Product Quality'
                                            id='disable-clearable'
                                            onChange={(e, newVal) =>
                                                setProductDetails({ ...productDetails, quality: newVal })
                                            }
                                            getOptionLabel={(option) => option || ""}
                                            options={productQualityOption}
                                            disableClearable
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label='Product Quality'
                                                    variant='standard'
                                                />
                                            )}
                                            value={
                                                productQualityOption.length > 0 &&
                                                productDetails.quality &&
                                                productQualityOption.find(
                                                    (ele) => ele === productDetails.quality
                                                )
                                            }
                                            disabled={isView}
                                        />
                                        {error?.quality && (
                                            <span
                                                style={{
                                                    color: "#da251e",
                                                    width: "100%",
                                                    textAlign: "start",
                                                }}
                                            >
                                                {error?.quality}
                                            </span>
                                        )}
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                    <div className='add-edit-product pt-0 pb-0'>
                        <div className='form'>
                            <h2 className='mb-3'>Contract details</h2>
                            <div>
                                <Row>
                                    <Col lg={3}>
                                        <Autocomplete
                                            options={CurrencyOptions}
                                            getOptionLabel={(option) => option.label || ""}
                                            id='disable-clearable'
                                            label='Contract Currency'
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label='Contract Currency'
                                                    variant='standard' />
                                            )}
                                            onChange={(e, newVal) =>
                                                setContractDetails({
                                                    ...contractDetails,
                                                    currency: newVal.label,
                                                })
                                            }
                                            value={CurrencyOptions && contractDetails?.currency && CurrencyOptions.find(
                                                (ele) => ele.label === contractDetails.currency)}
                                            disableClearable
                                            disabled={isView}
                                        />
                                        {error?.currency && (<span style={{
                                            color: "#da251e",
                                            width: "100%",
                                            textAlign: "start",
                                        }}>
                                            {error?.currency}
                                        </span>
                                        )}
                                    </Col>
                                    <Col lg={3}>
                                        <TextField
                                            label='Contract Value'
                                            variant='standard'
                                            color='warning'
                                            value={formateCurrencyValue(contractDetails.value)}
                                            onChange={(e) => handleChnage(e, "value", "contractDetails")}
                                            disabled={isView}
                                        />
                                        {error?.value && (
                                            <span
                                                style={{
                                                    color: "#da251e",
                                                    width: "100%",
                                                    textAlign: "start",
                                                }}
                                            >
                                                {error?.value}
                                            </span>
                                        )}
                                    </Col>
                                    <Col lg={3}>
                                        <form className='' noValidate>
                                            <TextField
                                                id='date'
                                                label='Contract Date'
                                                type='date'
                                                name='contractDate'
                                                value={contractDetails.contractDate}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                inputProps={{
                                                    max: new Date().toISOString().split("T")[0]
                                                }}
                                                onChange={(e) => setContractDetails({ ...contractDetails, contractDate: e.target.value })}
                                                // onChange={(e) =>
                                                //   setContractDetails({
                                                //     ...contractDetails,
                                                //     contractDate: e.target.value,
                                                //   })
                                                // }
                                                disabled={isView}
                                                required
                                            />
                                        </form>
                                        {error?.contractDate && (
                                            <span
                                                style={{
                                                    color: "#da251e",
                                                    width: "100%",
                                                    textAlign: "start",
                                                }}
                                            >
                                                {error?.contractDate}
                                            </span>
                                        )}
                                    </Col>
                                    <Col lg={3}>
                                        <form className='' noValidate>
                                            <TextField
                                                id='date'
                                                label='Expiry Date'
                                                type='date'
                                                name='expiryDate'
                                                value={contractDetails.expiryDate}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                inputProps={{
                                                    min: contractDetails.contractDate
                                                        ? new Date(contractDetails.contractDate)
                                                            .toISOString()
                                                            .split("T")[0]
                                                        : "",
                                                }}
                                                onChange={(e) =>
                                                    setContractDetails({
                                                        ...contractDetails,
                                                        expiryDate: e.target.value,
                                                    })
                                                }
                                                disabled={isView}
                                            />
                                        </form>
                                        {error?.expiryDate && (
                                            <span
                                                style={{
                                                    color: "#da251e",
                                                    width: "100%",
                                                    textAlign: "start",
                                                }}
                                            >
                                                {error?.expiryDate}
                                            </span>
                                        )}
                                    </Col>
                                </Row>
                                <Row className='mt-4'>
                                    <Col lg={6}>
                                        <TextField
                                            label='Conditions of Contract'
                                            variant='standard'
                                            color='warning'
                                            name='conditionsOfContract'
                                            value={contractDetails.conditionsOfContract}
                                            multiline
                                            maxRows={3}
                                            onChange={(e) => handleChnages(e)}
                                            // onClick={() => { setShowTextEditModal(true); setType('Conditions of contract'); setSelectedName('conditionsOfContract'); setSendModalData(contractDetails.conditionsOfContract) }}
                                            disabled={isView}
                                        />
                                        {error?.conditionsOfContract && (
                                            <span
                                                style={{
                                                    color: "#da251e",
                                                    width: "100%",
                                                    textAlign: "start",
                                                }}
                                            >
                                                {error?.conditionsOfContract}
                                            </span>
                                        )}
                                    </Col>
                                    <Col lg={6}>
                                        <TextField
                                            label='Description of Contract'
                                            variant='standard'
                                            color='warning'
                                            name='descriptionOfContract'
                                            value={contractDetails.descriptionOfContract}
                                            multiline
                                            maxRows={3}
                                            onChange={(e) => handleChnages(e)}
                                            // onClick={() => { setShowTextEditModal(true); setType('Description of contract'); setSelectedName('descriptionOfContract'); setSendModalData(contractDetails.descriptionOfContract) }}
                                            disabled={isView}
                                        />
                                        {error?.descriptionOfContract && (
                                            <span
                                                style={{
                                                    color: "#da251e",
                                                    width: "100%",
                                                    textAlign: "start",
                                                }}
                                            >
                                                {error?.descriptionOfContract}
                                            </span>
                                        )}
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                    <div className='add-edit-product'>
                        <div
                            className='form'
                            style={{ backgroundColor: "rgb(243, 243, 243)", border: "none" }}
                        >
                            <h2 className='mb-3'>Shipping options</h2>
                            <div>
                                <Row>
                                    <Col lg={4}>
                                        <Autocomplete
                                            label='Shipping Company'
                                            id='disable-clearable'
                                            onChange={(e, newVal) =>
                                                setShippingOptions({
                                                    ...shippingOptions,
                                                    shippingCompany: newVal.value,
                                                })
                                            }
                                            getOptionLabel={(option) => option.label || ""}
                                            options={shippingCompanyOption}
                                            disableClearable
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label='Shipping Company'
                                                    variant='standard'
                                                />
                                            )}
                                            disabled={isView}
                                            value={
                                                shippingCompanyOption.length > 0 &&
                                                shippingOptions.shippingCompany !==
                                                undefined &&
                                                shippingOptions.shippingCompany &&
                                                shippingCompanyOption.find(
                                                    (ele) =>
                                                        ele.value ===
                                                        shippingOptions.shippingCompany
                                                )
                                            }
                                        />
                                        {error?.shippingCompany && (
                                            <span
                                                style={{
                                                    color: "#da251e",
                                                    width: "100%",
                                                    textAlign: "start",
                                                }}
                                            >
                                                {error?.shippingCompany}
                                            </span>
                                        )}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={3}>
                                        <Autocomplete
                                            label='Shipment mode'
                                            id='disable-clearable'
                                            // onChange={(e, newVal) => setShippingOptions({ ...shippingOptions, shipmentMode: newVal })}
                                            onChange={(e, newVal) =>
                                                setShippingOptions({
                                                    ...shippingOptions,
                                                    shipmentMode: newVal,
                                                })
                                            }
                                            getOptionLabel={(option) => option || ""}
                                            options={shipmentModeOptions}
                                            disableClearable
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label='Shipment Mode'
                                                    variant='standard'
                                                />
                                            )}
                                            value={
                                                shippingOptions.shipmentMode &&
                                                shipmentModeOptions.find(
                                                    (ele) => ele === shippingOptions.shipmentMode
                                                )
                                            }
                                            disabled={isView}
                                        />
                                        {error?.shipmentMode && (
                                            <span
                                                style={{
                                                    color: "#da251e",
                                                    width: "100%",
                                                    textAlign: "start",
                                                }}
                                            >
                                                {error?.shipmentMode}
                                            </span>
                                        )}
                                    </Col>
                                    <Col lg={3}>
                                        <Autocomplete
                                            label='Country of Origin'
                                            id='disable-clearable'
                                            onChange={(e, newVal) => {
                                                setShippingOptions({
                                                    ...shippingOptions,
                                                    countryOfOrigin: newVal._id,
                                                })
                                                setPorts(newVal.name)
                                            }}
                                            getOptionLabel={(option) => option?.name || ""}
                                            options={countries}
                                            disableClearable
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label='Country of Origin'
                                                    variant='standard'
                                                />
                                            )}
                                            value={
                                                countries.length > 0 &&
                                                shippingOptions.countryOfOrigin &&
                                                countries.find(
                                                    (ele) => ele._id === shippingOptions.countryOfOrigin
                                                )
                                            }
                                            disabled={isView}
                                        />
                                        {error?.countryOfOrigin && (
                                            <span
                                                style={{
                                                    color: "#da251e",
                                                    width: "100%",
                                                    textAlign: "start",
                                                }}
                                            >
                                                {error?.countryOfOrigin}
                                            </span>
                                        )}
                                    </Col>
                                    <Col lg={3}>
                                        <Autocomplete
                                            label='Port of Origin'
                                            id='disable-clearable'
                                            onChange={(e, newVal) => {
                                                const mode = shippingOptions.shipmentMode

                                                if (mode === "SEA") {
                                                    setShippingOptions({
                                                        ...shippingOptions,
                                                        portOfOrigin: newVal._id,
                                                    })
                                                } else if (mode === "AIR") {
                                                    setShippingOptions({
                                                        ...shippingOptions,
                                                        airbaseOfOrigin: newVal._id,
                                                    })
                                                }
                                            }}
                                            getOptionLabel={(option) => option.name || ""}
                                            options={originCountry}
                                            disableClearable
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label='Port of Origin'
                                                    variant='standard'
                                                />
                                            )}
                                            // value={(originCountry?.length > 0 && shippingOptions.portOfOrigin) && originCountry.find((ele) => ele._id === shippingOptions.portOfOrigin)}
                                            value={
                                                (shippingOptions.shipmentMode === "SEA" &&
                                                    originCountry?.length > 0 &&
                                                    shippingOptions.portOfOrigin &&
                                                    originCountry.find(
                                                        (ele) => ele._id === shippingOptions.portOfOrigin
                                                    )) ||
                                                (shippingOptions.shipmentMode === "AIR" &&
                                                    originCountry?.length > 0 &&
                                                    shippingOptions.airbaseOfOrigin &&
                                                    originCountry.find(
                                                        (ele) => ele._id === shippingOptions.airbaseOfOrigin
                                                    ))
                                            }
                                            disabled={isView}
                                        />
                                        {error?.portOfOrigin && (
                                            <span
                                                style={{
                                                    color: "#da251e",
                                                    width: "100%",
                                                    textAlign: "start",
                                                }}
                                            >
                                                {error?.portOfOrigin}
                                            </span>
                                        )}
                                    </Col>
                                    <Col lg={3}>
                                        <form className='' noValidate>
                                            <TextField
                                                id='date'
                                                label='Shipment Date'
                                                type='date'
                                                name='shipmentDate'
                                                value={shippingOptions.shipmentDate}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                inputProps={{
                                                    min: contractDetails.contractDate,
                                                    max: contractDetails.expiryDate,
                                                }}
                                                disabled={isView}
                                                onChange={(e) =>
                                                    setShippingOptions({
                                                        ...shippingOptions,
                                                        shipmentDate: e.target.value,
                                                    })
                                                }
                                            />
                                        </form>
                                        {error?.shipmentDate && (
                                            <span
                                                style={{
                                                    color: "#da251e",
                                                    width: "100%",
                                                    textAlign: "start",
                                                }}
                                            >
                                                {error?.shipmentDate}
                                            </span>
                                        )}
                                    </Col>
                                </Row>
                                <Row className='mt-4'>
                                    <Col lg={3}>
                                        <Autocomplete
                                            label='Shipment terms'
                                            id='disable-clearable'
                                            onChange={(e, newVal) =>
                                                setShippingOptions({
                                                    ...shippingOptions,
                                                    shipmentTerms: newVal,
                                                })
                                            }
                                            getOptionLabel={(option) => option || ""}
                                            options={shipmentTermsOptions}
                                            disableClearable
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label='Shipment Terms'
                                                    variant='standard'
                                                />
                                            )}
                                            value={
                                                shippingOptions.shipmentTerms &&
                                                shipmentTermsOptions.find(
                                                    (ele) => ele === shippingOptions.shipmentTerms
                                                )
                                            }
                                            disabled={isView}
                                        />
                                        {error?.shipmentTerms && (
                                            <span
                                                style={{
                                                    color: "#da251e",
                                                    width: "100%",
                                                    textAlign: "start",
                                                }}
                                            >
                                                {error?.shipmentTerms}
                                            </span>
                                        )}
                                    </Col>
                                    <Col lg={3} className=''>
                                        <TextField
                                            label='Net Shipped Weights'
                                            variant='standard'
                                            color='warning'
                                            name='netShippedWeights'
                                            value={formateCurrencyValue(shippingOptions.shippedWeights)}
                                            onChange={(e) =>
                                                handleChnage(e, "shippedWeights", "shippingOptions")
                                            }
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position='start'>
                                                        {productDetails.metric}
                                                    </InputAdornment>
                                                ),
                                            }}
                                            disabled={isView}
                                        />
                                        {error?.shippedWeights && (
                                            <span
                                                style={{
                                                    color: "#da251e",
                                                    width: "100%",
                                                    textAlign: "start",
                                                }}
                                            >
                                                {error?.shippedWeights}
                                            </span>
                                        )}
                                    </Col>
                                    <Col lg={3}>
                                        <Autocomplete
                                            label='Destination country'
                                            id='disable-clearable'
                                            onChange={(e, newVal) => {
                                                setShippingOptions({
                                                    ...shippingOptions,
                                                    destinationCountry: newVal._id,
                                                })
                                                setPorts(newVal.name)
                                            }}
                                            getOptionLabel={(option) => option.name || ""}
                                            options={countries}
                                            disableClearable
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label='Destination Country'
                                                    variant='standard'
                                                />
                                            )}
                                            disabled={isView}
                                            value={
                                                countries.length > 0 &&
                                                shippingOptions.destinationCountry &&
                                                countries.find(
                                                    (ele) => ele._id === shippingOptions.destinationCountry
                                                )
                                            }
                                        />
                                        {error?.destinationCountry && (
                                            <span
                                                style={{
                                                    color: "#da251e",
                                                    width: "100%",
                                                    textAlign: "start",
                                                }}
                                            >
                                                {error?.destinationCountry}
                                            </span>
                                        )}
                                    </Col>
                                    <Col lg={3}>
                                        <Autocomplete
                                            label='Destination port'
                                            id='disable-clearable'
                                            // onChange={(e, newVal) => setShippingOptions({ ...shippingOptions, destinationPort: newVal._id })}
                                            onChange={(e, newVal) => {
                                                const mode = shippingOptions.shipmentMode
                                                if (mode === "SEA") {
                                                    setShippingOptions({
                                                        ...shippingOptions,
                                                        destinationPort: newVal._id,
                                                    })
                                                } else if (mode === "AIR") {
                                                    setShippingOptions({
                                                        ...shippingOptions,
                                                        destinationAirbase: newVal._id,
                                                    })
                                                }
                                            }}
                                            getOptionLabel={(option) => option.name}
                                            options={portsOptions ?? []}
                                            disableClearable
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label='Destination Port'
                                                    variant='standard'
                                                />
                                            )}
                                            disabled={isView}
                                            // value={(portsOptions?.length > 0 && shippingOptions?.destinationPort) && portsOptions.find((ele) => ele?._id === shippingOptions?.destinationPort)}
                                            value={
                                                (shippingOptions.shipmentMode === "SEA" &&
                                                    portsOptions?.length > 0 &&
                                                    shippingOptions.destinationPort &&
                                                    portsOptions.find(
                                                        (ele) => ele._id === shippingOptions.destinationPort
                                                    )) ||
                                                (shippingOptions.shipmentMode === "AIR" &&
                                                    portsOptions?.length > 0 &&
                                                    shippingOptions.destinationAirbase &&
                                                    portsOptions.find(
                                                        (ele) => ele._id === shippingOptions.destinationAirbase
                                                    ))
                                            }
                                        />
                                        {error?.destinationPort && (
                                            <span
                                                style={{
                                                    color: "#da251e",
                                                    width: "100%",
                                                    textAlign: "start",
                                                }}
                                            >
                                                {error?.destinationPort}
                                            </span>
                                        )}
                                    </Col>
                                </Row>
                                <Row className='mt-4'>
                                    <Col lg={6}>
                                        <Autocomplete
                                            label='Shipment frequency'
                                            id='disable-clearable'
                                            onChange={(e, newVal) =>
                                                setShippingOptions({
                                                    ...shippingOptions,
                                                    shipmentFrequency: newVal,
                                                })
                                            }
                                            getOptionLabel={(option) => option || ""}
                                            options={shipmentFrequencyOptions}
                                            disableClearable
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label='Shipment Frequency'
                                                    variant='standard'
                                                />
                                            )}
                                            disabled={isView}
                                            value={
                                                shipmentFrequencyOptions.length > 0 &&
                                                shippingOptions.shipmentFrequency &&
                                                shipmentFrequencyOptions.find(
                                                    (ele) => ele === shippingOptions.shipmentFrequency
                                                )
                                            }
                                        />
                                        {error?.shipmentFrequency && (
                                            <span
                                                style={{
                                                    color: "#da251e",
                                                    width: "100%",
                                                    textAlign: "start",
                                                }}
                                            >
                                                {error?.shipmentFrequency}
                                            </span>
                                        )}
                                    </Col>
                                    <Col lg={6}>
                                        <Autocomplete
                                            label='Warehouse required?'
                                            id='disable-clearable'
                                            onChange={(e, newVal) =>
                                                setShippingOptions({
                                                    ...shippingOptions,
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
                                                    shippingOptions.warehouseRequired === true) ||
                                                    shippingOptions.warehouseRequired === false) ?
                                                    warehouseRequiredOptions.find(
                                                        (ele) => ele.value === shippingOptions.warehouseRequired
                                                    ) : warehouseRequiredOptions = ''
                                            }
                                        />
                                        {error?.warehouseRequired && (
                                            <span
                                                style={{
                                                    color: "#da251e",
                                                    width: "100%",
                                                    textAlign: "start",
                                                }}
                                            >
                                                {error?.warehouseRequired}
                                            </span>
                                        )}
                                    </Col>
                                </Row>
                                {shippingOptions.warehouseRequired && (
                                    <div className='product p-0'>
                                        <div className='d-flex justify-content-between mt-5 mb-3 align-items-center'>
                                            <h2 className='m-0'>Warehouses</h2>
                                            <button
                                                className={`add_btn me-3 ${isView ? "d-none" : "d-block"}`}
                                                onClick={() => {
                                                    setAddWarehouseModal(true)
                                                }}
                                            >
                                                {" "}
                                                <img
                                                    src='../../assets/img/about/plus.png'
                                                    className='me-2'
                                                />
                                                Add
                                            </button>
                                        </div>
                                        <div>
                                            {shippingOptions.warehouses?.length > 0 ? (
                                                <MaterialTable
                                                    title=''
                                                    columns={[
                                                        {
                                                            title: "Warehouse Company",
                                                            field: "warehouseCompany.label",
                                                        },
                                                        { title: "Warehouse", field: "warehouse.label" },
                                                    ]}
                                                    data={shippingOptions.warehouses}
                                                    actions={
                                                        isView
                                                            ? [
                                                                {
                                                                    icon: "preview",
                                                                    tooltip: "View Entities",
                                                                    onClick: (e, rowData) => { },
                                                                },
                                                            ]
                                                            : [
                                                                {
                                                                    icon: "edit",
                                                                    tooltip: "Edit Entities",
                                                                    onClick: (e, rowData) => {
                                                                        setAddWarehouseModal(true)
                                                                        setWareHouseId(rowData)
                                                                    },
                                                                },
                                                                {
                                                                    icon: "preview",
                                                                    tooltip: "View Entities",
                                                                    onClick: (e, rowData) => { },
                                                                },
                                                            ]
                                                    }
                                                    options={{
                                                        filtering: true,
                                                        actionsColumnIndex: -1,
                                                        sorting: true,
                                                        pageSize: 10,
                                                        search: false,
                                                        emptyRowsWhenPaging: false,
                                                    }}
                                                />
                                            ) : (
                                                "No data found"
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className='add-edit-product pt-0 pb-0'>
                        <div
                            className='form'
                            style={{ backgroundColor: "rgb(243, 243, 243)", border: "none" }}
                        >
                            <h2 className='mb-3'>Transshipment Options</h2>
                            <div>
                                <Row>
                                    <Col lg={3}>
                                        <Autocomplete
                                            label='Transhipment required?'
                                            id='disable-clearable'
                                            onChange={(e, newVal) => {
                                                if (newVal.value) {
                                                    setTransShipmentOptions({
                                                        ...transShipmentOptions,
                                                        tranShipmentRequired: newVal.value,
                                                    })
                                                } else {
                                                    setTransShipmentOptions({
                                                        tranShipmentRequired: newVal.value,
                                                        street: "",
                                                        city: "",
                                                        country: "",
                                                        transShipmentQuantity: "",
                                                        transShipmentDate: "",
                                                    })
                                                }
                                            }}
                                            getOptionLabel={(option) => option.label}
                                            options={options}
                                            disableClearable
                                            disabled={isView}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label='Transhipment Required?'
                                                    variant='standard'
                                                />
                                            )}
                                            value={((options.length > 0 && transShipmentOptions.tranShipmentRequired === true) || transShipmentOptions.tranShipmentRequired === false) ?
                                                options.find(
                                                    (ele) =>
                                                        ele.value === transShipmentOptions.tranShipmentRequired
                                                ) : options = ""
                                            }
                                        />
                                        {error?.tranShipmentRequired && (
                                            <span
                                                style={{
                                                    color: "#da251e",
                                                    width: "100%",
                                                    textAlign: "start",
                                                }}
                                            >
                                                {error?.tranShipmentRequired}
                                            </span>
                                        )}
                                    </Col>
                                    {transShipmentOptions.tranShipmentRequired && (
                                        <>
                                            <Col lg={3}>
                                                <TextField
                                                    label='Street'
                                                    variant='standard'
                                                    color='warning'
                                                    value={transShipmentOptions.street}
                                                    name='street'
                                                    onChange={(e) =>
                                                        setTransShipmentOptions({
                                                            ...transShipmentOptions,
                                                            street: e.target.value,
                                                        })
                                                    }
                                                    disabled={isView}
                                                />
                                                {error?.street && (
                                                    <span
                                                        style={{
                                                            color: "#da251e",
                                                            width: "100%",
                                                            textAlign: "start",
                                                        }}
                                                    >
                                                        {error?.street}
                                                    </span>
                                                )}
                                            </Col>
                                            <Col lg={3}>
                                                <TextField
                                                    label='City'
                                                    variant='standard'
                                                    color='warning'
                                                    value={transShipmentOptions.city}
                                                    name='city'
                                                    onChange={(e) =>
                                                        setTransShipmentOptions({
                                                            ...transShipmentOptions,
                                                            city: e.target.value,
                                                        })
                                                    }
                                                    disabled={isView}
                                                />
                                                {error?.city && (
                                                    <span
                                                        style={{
                                                            color: "#da251e",
                                                            width: "100%",
                                                            textAlign: "start",
                                                        }}
                                                    >
                                                        {error?.city}
                                                    </span>
                                                )}
                                            </Col>
                                            <Col lg={3}>
                                                <Autocomplete
                                                    label='Country'
                                                    id='disable-clearable'
                                                    onChange={(e, newVal) =>
                                                        setTransShipmentOptions({
                                                            ...transShipmentOptions,
                                                            country: newVal._id,
                                                        })
                                                    }
                                                    getOptionLabel={(option) => option.name || ""}
                                                    options={countries}
                                                    disableClearable
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label='Country'
                                                            variant='standard'
                                                        />
                                                    )}
                                                    disabled={isView}
                                                    value={
                                                        countries.length > 0 &&
                                                        transShipmentOptions.country &&
                                                        countries.find(
                                                            (ele) => ele._id === transShipmentOptions.country
                                                        )
                                                    }
                                                />
                                                {error?.country && (
                                                    <span
                                                        style={{
                                                            color: "#da251e",
                                                            width: "100%",
                                                            textAlign: "start",
                                                        }}
                                                    >
                                                        {error?.country}
                                                    </span>
                                                )}
                                            </Col>
                                            <Row className='mt-4'>
                                                <Col lg={4}>
                                                    <TextField
                                                        label='Transshipment Quantity'
                                                        variant='standard'
                                                        color='warning'
                                                        name='conditions_of_contract'
                                                        value={formateCurrencyValue(transShipmentOptions.transShipmentQuantity)}
                                                        disabled={isView}
                                                        onChange={(e) =>
                                                            handleChnage(
                                                                e,
                                                                "transShipmentQuantity",
                                                                "transShipmentOptions"
                                                            )
                                                        }
                                                    />
                                                    {error?.transShipmentQuantity && (
                                                        <span
                                                            style={{
                                                                color: "#da251e",
                                                                width: "100%",
                                                                textAlign: "start",
                                                            }}
                                                        >
                                                            {error?.transShipmentQuantity}
                                                        </span>
                                                    )}
                                                </Col>
                                                <Col lg={4}>
                                                    <TextField
                                                        label='Transshipment Unit'
                                                        variant='standard'
                                                        color='warning'
                                                        name='conditions_of_contract'
                                                        value={
                                                            transShipmentOptions.tranShipmentRequired &&
                                                            productDetails.metric
                                                        }
                                                        // value={transShipmentOptions.transShipmentUnit}
                                                        disabled={isView || productDetails.metric}
                                                    // onChange={(e) => handleChnage(e, 'transShipmentUnit', 'transShipmentOptions')}
                                                    />
                                                    {error?.transShipmentUnit && (
                                                        <span
                                                            style={{
                                                                color: "#da251e",
                                                                width: "100%",
                                                                textAlign: "start",
                                                            }}
                                                        >
                                                            {error?.transShipmentUnit}
                                                        </span>
                                                    )}
                                                </Col>
                                                <Col lg={4}>
                                                    <form className='' noValidate>
                                                        <TextField
                                                            id='date'
                                                            label='Transhipment Date'
                                                            type='date'
                                                            name='contract_date'
                                                            value={transShipmentOptions.transShipmentDate}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            inputProps={{
                                                                min: shippingOptions.shipmentDate,
                                                                max: contractDetails.expiryDate,
                                                            }}
                                                            disabled={isView}
                                                            onChange={(e) =>
                                                                setTransShipmentOptions({
                                                                    ...transShipmentOptions,
                                                                    transShipmentDate: e.target.value,
                                                                })
                                                            }
                                                        />
                                                    </form>
                                                    {error?.transShipmentDate && (
                                                        <span
                                                            style={{
                                                                color: "#da251e",
                                                                width: "100%",
                                                                textAlign: "start",
                                                            }}
                                                        >
                                                            {error?.transShipmentDate}
                                                        </span>
                                                    )}
                                                </Col>
                                            </Row>
                                        </>
                                    )}
                                </Row>
                            </div>
                        </div>
                    </div>
                    {/* <div className='product'>
                    <div className='mb-3 d-flex justify-content-between align-items-center'>
                        <h2 className='m-0'>Insurances</h2>
                        <button className='add_btn me-3' onClick={() => setAddInsuranceModal(true)}> <img src='../../assets/img/about/plus.png' className='me-2' />Add</button>
                    </div>
                    <MaterialTable
                        title=""
                        columns={[
                            { title: 'Name', field: 'label' },
                            { title: 'Product', field: 'product' },
                            { title: 'Type', field: 'type' },
                            // { title: 'Expiry Date', field: 'expiryDate', type: 'date', },
                            // { title: 'Family', field: 'family' },
                            // { title: 'Type', field: 'type' },
                            // { title: 'Status', field: 'status' },
                        ]}
                        // data={productGetData?.data}
                        data={cardData}
                        actions={[
                            {
                                icon: 'edit',
                                tooltip: 'Edit Product',
                                onClick: () => setAddInsuranceModal(true),
                            },
                            {
                                icon: 'preview',
                                tooltip: 'View Product',
                                onClick: () => setAddInsuranceModal(true),
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
                </div> */}
                    <div className='add-edit-product pt-0 pb-0'>
                        <div className='form'>
                            <h2 className='mb-3'>Pricing Details</h2>
                            <div>
                                <Row>
                                    <Col
                                        lg={
                                            pricingDetails.pricingType === "Firm fixed price"
                                                ? 3
                                                : 4 || pricingDetails.pricingHedgeingStatus === "Yes"
                                                    ? 3
                                                    : 4
                                        }
                                    >
                                        <Autocomplete
                                            label='Pricing type'
                                            id='disable-clearable'
                                            onChange={(e, newVal) =>
                                                setPricingDetails({
                                                    ...pricingDetails,
                                                    pricingType: newVal,
                                                })
                                            }
                                            getOptionLabel={(option) => option || ""}
                                            options={pricingTypeOption}
                                            disableClearable
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label='Pricing Type'
                                                    variant='standard'
                                                />
                                            )}
                                            disabled={isView}
                                            value={
                                                pricingTypeOption.length > 0 &&
                                                pricingDetails.pricingType &&
                                                pricingTypeOption.find(
                                                    (ele) => ele === pricingDetails.pricingType
                                                )
                                            }
                                        />
                                        {error?.pricingType && (
                                            <span
                                                style={{
                                                    color: "#da251e",
                                                    width: "100%",
                                                    textAlign: "start",
                                                }}
                                            >
                                                {error?.pricingType}
                                            </span>
                                        )}
                                    </Col>
                                    {pricingDetails.pricingType === "Firm fixed price" && (
                                        <>
                                            <Col
                                                lg={
                                                    pricingDetails.pricingType === "Firm fixed price" ? 3 : 4
                                                }
                                            >
                                                <TextField
                                                    label="Pricing Amount"
                                                    // label='Mertic measure'
                                                    variant='standard'
                                                    color='warning'
                                                    value={formateCurrencyValue(pricingDetails.pricingAmount)}
                                                    name='contract_value'
                                                    onChange={(e) =>
                                                        handleChnage(e, "pricingAmount", "pricingDetails")
                                                    }
                                                    disabled={isView}
                                                />
                                                {error?.pricingAmount && (
                                                    <span
                                                        style={{
                                                            color: "#da251e",
                                                            width: "100%",
                                                            textAlign: "start",
                                                        }}
                                                    >
                                                        {error?.pricingAmount}
                                                    </span>
                                                )}
                                            </Col>
                                            <Col
                                                lg={
                                                    pricingDetails.pricingType === "Firm fixed price" ? 3 : 4
                                                }
                                            >
                                                <TextField
                                                    label='Pricing Unit'
                                                    variant='standard'
                                                    color='warning'
                                                    // value={selectedProduct && selectedProduct}
                                                    value={selectedProduct && selectedProduct}
                                                    onChange={(e) => handleChnage(e, "pricingUnit", "pricingDetails")}
                                                    disabled
                                                />
                                            </Col>
                                            <Col
                                                lg={
                                                    pricingDetails.pricingType === "Firm fixed price" ? 3 : 4
                                                }
                                            >
                                                <TextField
                                                    label='Previous Day Closing Amount'
                                                    variant='standard'
                                                    color='warning'
                                                    value={pricingDetails.previousDayClosingAmount}
                                                    name='previous_day_closing_amount'
                                                    onChange={(e) =>
                                                        handleChnage(
                                                            e,
                                                            "previousDayClosingAmount",
                                                            "pricingDetails"
                                                        )
                                                    }
                                                    disabled={isView}
                                                />
                                                {error?.previousDayClosingAmount && (
                                                    <span
                                                        style={{
                                                            color: "#da251e",
                                                            width: "100%",
                                                            textAlign: "start",
                                                        }}
                                                    >
                                                        {error?.previousDayClosingAmount}
                                                    </span>
                                                )}
                                            </Col>
                                        </>
                                    )}
                                    {pricingDetails.pricingType === "Price to be fixed" && (
                                        <>
                                            <Col lg={pricingDetails.pricingHedgeingStatus ? 3 : 4}>
                                                <Autocomplete
                                                    label='Pricing formula'
                                                    id='disable-clearable'
                                                    onChange={(e, newVal) =>
                                                        setPricingDetails({
                                                            ...pricingDetails,
                                                            pricingFormula: newVal,
                                                        })
                                                    }
                                                    getOptionLabel={(option) => option || ""}
                                                    options={pricingFormulaOption}
                                                    disableClearable
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label='Pricing Formula'
                                                            variant='standard'
                                                        />
                                                    )}
                                                    disabled={isView}
                                                    value={
                                                        pricingFormulaOption.length > 0 &&
                                                        pricingDetails.pricingFormula &&
                                                        pricingFormulaOption.find(
                                                            (ele) => ele === pricingDetails.pricingFormula
                                                        )
                                                    }
                                                />
                                                {error?.pricingFormula && (
                                                    <span
                                                        style={{
                                                            color: "#da251e",
                                                            width: "100%",
                                                            textAlign: "start",
                                                        }}
                                                    >
                                                        {error?.pricingFormula}
                                                    </span>
                                                )}
                                            </Col>
                                            <Col lg={pricingDetails.pricingHedgeingStatus ? 3 : 4}>
                                                <Autocomplete
                                                    label='Pricing Hedging status'
                                                    id='disable-clearable'
                                                    onChange={(e, newVal) =>
                                                        setPricingDetails({
                                                            ...pricingDetails,
                                                            pricingHedgeingStatus: newVal.value,
                                                        })
                                                    }
                                                    getOptionLabel={(option) => option.label || ""}
                                                    options={warehouseRequiredOptions}
                                                    disableClearable
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label='Price Hedging Status'
                                                            variant='standard'
                                                        />
                                                    )}
                                                    disabled={isView}
                                                    value={
                                                        ((warehouseRequiredOptions.length > 0 &&
                                                            pricingDetails.pricingHedgeingStatus === true) ||
                                                            pricingDetails.pricingHedgeingStatus === false) && Array.isArray(warehouseRequiredOptions) ?
                                                            warehouseRequiredOptions.find(
                                                                (ele) =>
                                                                    ele.value === pricingDetails.pricingHedgeingStatus
                                                            ) : warehouseRequiredOptions === ''
                                                    }
                                                />
                                                {error?.pricingHedgeingStatus && (
                                                    <span
                                                        style={{
                                                            color: "#da251e",
                                                            width: "100%",
                                                            textAlign: "start",
                                                        }}
                                                    >
                                                        {error?.pricingHedgeingStatus}
                                                    </span>
                                                )}
                                            </Col>
                                            {pricingDetails.pricingHedgeingStatus && (
                                                <>
                                                    <Col lg={3}>
                                                        <Autocomplete
                                                            label='Hedging method'
                                                            id='disable-clearable'
                                                            onChange={(e, newVal) =>
                                                                setPricingDetails({
                                                                    ...pricingDetails,
                                                                    pricingHedgingMethod: newVal,
                                                                })
                                                            }
                                                            getOptionLabel={(option) => option || ""}
                                                            options={hedgingMethodOption}
                                                            disableClearable
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    label='Hedging method'
                                                                    variant='standard'
                                                                />
                                                            )}
                                                            disabled={isView}
                                                            value={
                                                                hedgingMethodOption.length > 0 &&
                                                                pricingDetails.pricingHedgingMethod &&
                                                                hedgingMethodOption.find(
                                                                    (ele) =>
                                                                        ele === pricingDetails.pricingHedgingMethod
                                                                )
                                                            }
                                                        />
                                                        {error?.pricingHedgingMethod && (
                                                            <span
                                                                style={{
                                                                    color: "#da251e",
                                                                    width: "100%",
                                                                    textAlign: "start",
                                                                }}
                                                            >
                                                                {error?.pricingHedgingMethod}
                                                            </span>
                                                        )}
                                                    </Col>
                                                    <Row>
                                                        <Col lg={12}>
                                                            <Autocomplete
                                                                label='Counter party'
                                                                id='disable-clearable'
                                                                onChange={(e, newVal) =>
                                                                    setPricingDetails({
                                                                        ...pricingDetails,
                                                                        pricingCounterParty: newVal.value,
                                                                    })
                                                                }
                                                                getOptionLabel={(option) => option.label || ""}
                                                                options={counterPartyOption}
                                                                disableClearable
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        {...params}
                                                                        label='Counterparty'
                                                                        variant='standard'
                                                                    />
                                                                )}
                                                                disabled={isView}
                                                                value={
                                                                    counterPartyOption.length > 0 &&
                                                                    pricingDetails.pricingCounterParty !==
                                                                    undefined &&
                                                                    pricingDetails.pricingCounterParty &&
                                                                    counterPartyOption.find(
                                                                        (ele) =>
                                                                            ele.value ===
                                                                            pricingDetails.pricingCounterParty
                                                                    )
                                                                }
                                                            />
                                                            {error?.pricingCounterParty && (
                                                                <span
                                                                    style={{
                                                                        color: "#da251e",
                                                                        width: "100%",
                                                                        textAlign: "start",
                                                                    }}
                                                                >
                                                                    {error?.pricingCounterParty}
                                                                </span>
                                                            )}
                                                        </Col>
                                                    </Row>
                                                </>
                                            )}
                                        </>
                                    )}
                                </Row>
                            </div>
                        </div>
                    </div>
                    {addWarehouseModal && (
                        <AddWareHouseModal
                            show={addWarehouseModal}
                            onHide={() => {
                                setAddWarehouseModal(false)
                                setWareHouseId("")
                            }}
                            wareHouseData={(e, id) => warehouseData(e, id)}
                            wareHouseId={wareHouseId}
                        />
                    )}
                    {/* {addWarehouseModal && <AddWareHouseModal show={addWarehouseModal} onHide={() => setAddWarehouseModal(false)} wareHouseData={(data) => setShippingOptions({ ...shippingOptions, warehouses: [...shippingOptions.warehouses, data] })} wareHouseId={wareHouseId} />} */}
                    {addInsuranceModal && (
                        <AddInsuranceModal
                            show={addInsuranceModal}
                            onHide={() => setAddInsuranceModal(false)}
                        />
                    )}
                    {/* {showTextEditModal && <TextEditerModal show={showTextEditModal} onHide={() => setShowTextEditModal(false)} commentDone={(e) => hadleChangeModal(e)} data={sendModalData} type={type} inputName={selectedName} />} */}
                    <div className='footer_'>
                        <button
                            onClick={() => navigate("/transactions")}
                            className='footer_cancel_btn'
                        >
                            cancel
                        </button>
                        <button onClick={() => next()} className='footer_next_btn'>
                            {" "}
                            Next
                        </button>
                    </div>
                </>
            }
        </>
    )
}


export default DetailsTransaction