import React, { useEffect, useState } from 'react'

import Box from '@material-ui/core/Box';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useLocation } from 'react-router-dom';
import DetailsTransaction from './DetailsTransaction';
import KeyParties from './KeyParties';
import DocumentFlow from './DocumentFlow';
import FundFlow from './FundFlow';
import Facility from './Facility';
import { getTransactionById } from '../../redux/actions/transactionDataAction';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

const stepsforexport = ['TransactionDetails', 'Key Parties', 'Document Flow', 'Fund Flow', 'Facility'];
const stepsforimport = ['Key Parties', 'Document Flow', 'Fund Flow', 'Facility'];

const Edit_Transactions = () => {

    const location = useLocation();
    const dispatch = useDispatch()
    const queryParams = new URLSearchParams(location.search)
    const id = queryParams.get("id")
    const transactionType = location?.state[0]?.type    
    const productNature = location?.state[1]?.type
    const isView = location?.state[2]?.isView
    const [getTrans, setGetTrans] = useState({})
    const [transId, setTransId] = useState("");
    const [getLender, setGetLender] = useState("")
    const [getBorrower, setGetBorrower] = useState("")
    const [getWarehouseCompany, setGetWarehouseCompany] = useState("")
    const [getCounterParty, setGetCounterParty] = useState("")
    const [getShippingCompany, setGetShippingCompany] = useState("")

    const [activeStep, setActiveStep] = useState(0);
    let step = []
    const getTransactionId = useSelector(state => state.transactionData.getTransactionById)
    // console.log('check this', getTransactionId.data.details?.contractDetails?.currency)

    useEffect(() => {
        if (id) {
            dispatch(getTransactionById(id))
            let transdata = {
                "id": id,
                "currency": getTransactionId.data?.details?.contractDetails?.currency,
                "value": getTransactionId.data?.details?.contractDetails?.value
            }

            setTransId(id);
            localStorage.setItem('details', JSON.stringify(transdata))

        }
    }, [id])

    const signalContract = (values) => {
        setGetTrans(values)
    }
    const signalLender = (values) => {
        setGetLender(values)
    }
    const signalBorrower = (values) => {
        setGetBorrower(values)
    }
    
    const signalWarehouseCompany = (values) => {
        setGetWarehouseCompany(values)
    }
    const signalCounterParty = (values) => {
       return setGetCounterParty(values)
    }
    const signalShippingCompany = (values) => {
        return setGetShippingCompany(values)
    }

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    if (transactionType === "Export") {
        step = stepsforexport
    } else {
        step = stepsforimport
    }

    const handleReset = () => {
        setActiveStep(0);
    };
    return (
        <>
            <div className='add-edit-product'>

                <Box sx={{ width: '100%' }}>
                    {productNature === 'Physical' &&
                        <Stepper activeStep={activeStep} alternativeLabel>
                            {step.length && step?.map((label, index) => {
                                const stepProps = {};
                                const labelProps = {};
                                return (
                                    <Step key={label} {...stepProps}>
                                        <StepLabel {...labelProps}>{label}</StepLabel>
                                    </Step>
                                );
                            })}
                        </Stepper>}
                    {activeStep === step.length ? (
                        <React.Fragment>
                            <Typography sx={{ mt: 2, mb: 1 }}>
                                All steps completed - you&apos;re finished
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                <Box sx={{ flex: '1 1 auto' }} />
                                <Button onClick={handleReset}>Reset</Button>
                            </Box>
                        </React.Fragment>
                    ) : (
                        <>
                            {

                                transactionType === "Export" ? <React.Fragment>
                                    {
                                        productNature === 'Physical' ?
                                            <>
                                                {activeStep + 1 === 1 && <DetailsTransaction hendelNext={handleNext} signalShippingCompany={signalShippingCompany} signalCounterParty={signalCounterParty} signalContract={signalContract} signalWarehouseCompany={signalWarehouseCompany} signalLender={signalLender} signalBorrower={signalBorrower} transactionType={transactionType} transaction_id={transId} />}
                                                {activeStep + 1 === 2 && <KeyParties hendelNext={handleNext} getShippingCompany={getShippingCompany} getCounterParty={getCounterParty} getLender={getLender} getBorrower={getBorrower} getWarehouseCompany={getWarehouseCompany} hendelCancel={handleBack} transactionType={transactionType} />}
                                                {activeStep + 1 === 3 && <DocumentFlow hendelNext={handleNext} hendelCancel={handleBack} />}
                                                {activeStep + 1 === 4 && <FundFlow hendelNext={handleNext} getTrans={getTrans} hendelCancel={handleBack} />}
                                                {activeStep + 1 === 5 && <Facility hendelNext={handleNext} hendelCancel={handleBack} />}
                                            </>
                                            :
                                            <>
                                                <div style={{ height: "88vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                    <p style={{ fontSize: '48px', fontWeight: "bold" }}>Product not yet available. Coming soon</p>
                                                </div>
                                            </>
                                    }
                                </React.Fragment>
                                    :
                                    <React.Fragment>
                                        <div style={{ height: "88vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <p style={{ fontSize: '48px', fontWeight: "bold" }}>Product not yet available. Coming soon</p>
                                        </div>
                                        {/* 
                                        {activeStep + 1 === 1 && <KeyParties hendelNext={handleNext} hendelCancel={handleBack} transactionType={transactionType}/>}
                                        {activeStep + 1 === 2 && <DocumentFlow hendelNext={handleNext} hendelCancel={handleBack} />}
                                        {activeStep + 1 === 3 && <FundFlow hendelNext={handleNext} hendelCancel={handleBack} />}
                                        {activeStep + 1 === 4 && <Facility hendelNext={handleNext} hendelCancel={handleBack} />} */}
                                    </React.Fragment>
                            }
                        </>

                    )}
                </Box>


            </div>
        </>
    )
}

export default Edit_Transactions