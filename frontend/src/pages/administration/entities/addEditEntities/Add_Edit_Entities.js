import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Details from './Details'
import Financials from './Financials'
import Licences from './Licences'
import Ratings from './Ratings'
import Warehouse from './Warehouse'
import Roles from './Roles'
import Box from '@material-ui/core/Box';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import IndividualDetail from '../individual/Details'
import IndividualAddress from '../individual/Address'
import { useDispatch } from 'react-redux'
import { entityGetByIdAction } from '../../../../redux/actions/entityAction'
import { useSelector } from 'react-redux'
import { companydataAction } from '../../../../redux/actions/companydataAction'

const Add_Edit_Entities = () => {

    const location = useLocation();
    const dispatch = useDispatch();
    const queryParams = new URLSearchParams(location.search)
    const id = queryParams.get("id")
    const entityType = location.state[0]?.type
    let steps = location.state[0]?.type === "Company" ? ['Details', 'Financials', 'Licences', 'Ratings', 'Warehouse', 'Roles'] : ['Details', "Address"]
    const [activeStep, setActiveStep] = React.useState(0);
    const [individualDetailData, setIndividualDetailData] = React.useState({});
    const [common, setCommon] = React.useState({});

    const entityGetById = useSelector((state) => state.entityData.getEntityById)

    useEffect(() => {
        if (id) {
            dispatch(entityGetByIdAction(id))
        }
    }, [id])

    useEffect(() => {
        console.log('entityType', entityType)
    }, [entityType])


    useEffect(() => {
        if (entityGetById && entityGetById.data && entityGetById.status === 200) {
            const address = entityGetById.data.addresses.map((ele) => {
                return {
                    _id: ele?._id,
                    type: ele?.type,
                    flatNumber: ele?.flatNumber,
                    addressLine1: ele?.addressLine1,
                    addressLine2: ele?.addressLine2,
                    addressLine3: ele?.addressLine3,
                    postcode: ele?.postcode,
                    state: ele?.state,
                    city: ele?.city,
                    country: ele?.country?._id,
                    mobile: ele?.mobile,
                    telephone: ele?.telephone,
                    fax: ele?.fax,
                    email: ele?.email,
                }
            })

            const details = {
                _id: entityGetById?.data?.details?._id,
                name: entityGetById?.data?.details?.name,
                country: entityGetById?.data?.details?.country?._id,
                registrationNumber: entityGetById?.data?.details?.registrationNumber,
                dateOfIncorporation: entityGetById?.data?.details?.dateOfIncorporation,
                sector: entityGetById?.data?.details?.sector,
                subSector: entityGetById?.data?.details?.subSector,
                mainActivity: entityGetById?.data?.details?.mainActivity,
            }

            const financialData = {
                _id: entityGetById?.data?.financial?._id,
                netProfitMargin: entityGetById?.data?.financial?.netProfitMargin,
                ROE: entityGetById?.data?.financial?.ROE,
                ROA: entityGetById?.data?.financial?.ROA,
                operatingCashFlow: entityGetById?.data?.financial?.operatingCashFlow,
                debtServiceCoverageRatio: entityGetById?.data?.financial?.debtServiceCoverageRatio,
                interestCoverageRatio: entityGetById?.data?.financial?.interestCoverageRatio,
                netGearingRatio: entityGetById?.data?.financial?.netGearingRatio,
                totalDebtToTotalCapital: entityGetById?.data?.financial?.totalDebtToTotalCapital,
                currentRatio: entityGetById?.data?.financial?.currentRatio,
                quickRatio: entityGetById?.data?.financial?.quickRatio,
                cashFlowBeforeFinancingSales: entityGetById?.data?.financial?.cashFlowBeforeFinancingSales,
            }

            const licencesData = entityGetById.data.licenses.map((ele) => {
                return {
                    _id: ele._id,
                    type: ele.type,
                    number: ele.number,
                    authority: ele.authority,
                    country: ele.country,
                    dateofrating: ele.dateOfRating,
                    expirydate: ele.expiryDate,
                    evidence: ele.evidence,
                }
            })

            const ratingData = entityGetById.data.ratings.map((ele) => {
                return {
                    _id: ele._id,
                    agency: ele.agency,
                    rating: ele.rating,
                    dateOfRating: ele.dateOfRating,
                    expiryDate: ele.expiryDate,
                }
            })

            const warehouseData = entityGetById.data.warehouses.map((ele) => {
                return {
                    _id: ele._id,
                    nature: ele.nature,
                    name: ele.name,
                    type: ele.type,
                    city: ele.city,
                    country: ele.country,
                    governingLaw: ele.governingLaw,
                }
            })

            const roleData = entityGetById.data.roles.map((ele) => {
                return {
                    _id: ele._id,
                    roles: ele.roleId?._id,
                    justification: ele.justification
                }
            })

            let companydata = {
                email: entityGetById.data.email,
                password: entityGetById.data.password,
                type: entityGetById.data.type,
                detail: details,
                addresses: address,
                financial: financialData,
                licenses: licencesData,
                ratings: ratingData,
                warehouses: warehouseData,
                roles: roleData,
            }
            dispatch(companydataAction(companydata))
        }
    }, [entityGetById])

    useEffect(() => {
        console.log('entityType', entityType)
    }, [entityType])


    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };
    const getIndividualDetailData = (e) => {
        setIndividualDetailData(e)
    }
    return (
        <>

            <Box sx={{ width: '100%' }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.length && steps.map((label, index) => {
                        const stepProps = {};
                        const labelProps = {};
                        return (
                            <Step key={label} {...stepProps}>
                                <StepLabel {...labelProps}>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
                {activeStep === steps.length ? (
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
                        {entityType === "Company" ?
                            <React.Fragment>
                                {activeStep + 1 === 1 && <Details hendelNext={handleNext} entityType={entityType} />}
                                {activeStep + 1 === 2 && <Financials hendelNext={handleNext} hendelCancel={handleBack} />}
                                {activeStep + 1 === 3 && <Licences hendelNext={handleNext} hendelCancel={handleBack} />}
                                {activeStep + 1 === 4 && <Ratings hendelNext={handleNext} hendelCancel={handleBack} />}
                                {activeStep + 1 === 5 && <Warehouse hendelNext={handleNext} hendelCancel={handleBack} />}
                                {activeStep + 1 === 6 && <Roles hendelNext={handleNext} hendelCancel={handleBack} />}
                            </React.Fragment> :
                            <React.Fragment>
                                {activeStep + 1 === 1 && <IndividualDetail hendelNext={handleNext} getDetailData={getIndividualDetailData} getCommonData={setCommon} entityType={entityType} />}
                                {activeStep + 1 === 2 && <IndividualAddress hendelNext={handleNext} hendelCancel={handleBack} sendDetailData={individualDetailData} common={common} />}
                            </React.Fragment>
                        }
                    </>

                )}
            </Box>
        </>
    )
}

export default Add_Edit_Entities