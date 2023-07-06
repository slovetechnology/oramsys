"use strict"

const mongoose = require('mongoose')
var Schema = mongoose.Schema

var Schema = new Schema({
    type: { type: String, required: true },
    userId: { type: String, required: true, default: null },
    lenders: { type: String, required: false, default: null },
    borrower_Applicant: { type: String, required: false, default: null },
    termSheet: { type: String, required: true, default: "Not Signed" },
    termSheetURL: { type: String, required: false, default: null },
    details: { type: Schema.Types.ObjectId, ref: "TransactionDetails", required: false, default: null },
    keyParties: [{ type: Schema.Types.ObjectId, ref: "TransactionKeyParties", required: false, default: null }],
    documentFlow: { type: Schema.Types.ObjectId, ref: "TransactionDocumentFlow", required: false, default: null },
    fundFlow: { type: Schema.Types.ObjectId, ref: "TransactionFundFlow", required: false, default: null },
    facility: { type: Schema.Types.ObjectId, ref: "TransactionFacility", required: false, default: null },
    isDeleted: { type: Boolean, required: true, default: false },
}, {
    timestamps: true
})

Schema.index({ name: "text" })

Schema.statics.createTransaction = async function () {
    return await this.Save()
}

Schema.statics.getAll = async function () {
    return await this.find({ isDeleted: false })
        .populate({
            path: "details",
            populate: [
                {
                    path: 'productDetails',
                    populate: {
                        path: "name",
                        select: ['name']
                    },
                },
                {
                    path: 'shippingOptions',
                    populate: [
                        {
                            path: "destinationCountry",
                            select: ['name']
                        },
                        {
                            path: "destinationPort",
                            select: ['name']
                        },
                        {
                            path: "countryOfOrigin",
                            select: ['name']
                        },
                        {
                            path: "portOfOrigin",
                            select: ['name']
                        },
                       
                        {
                            path: "warehouses",
                            populate: [
                                {
                                    path: 'warehouseCompany',
                                    select: ['details'],
                                    populate: {
                                        path: 'details',
                                        select: ['name']
                                    }
                                },
                                {
                                    path: 'warehouse',
                                    select: ['name']
                                },
                            ]
                        },
                        {
                        path: "shippingOptions",
                        populate: {
                            path: "shippingCompany",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                    },
                    ],
                },
                {
                    path: 'transShipmentOptions',
                    populate: {
                        path: "country",
                        select: ['name']
                    },
                },
                {
                    path: "pricingDetails",
                    populate: {
                        path: "pricingCounterParty",
                        select: ['details'],
                        populate: {
                            path: 'details',
                            select: ['name']
                        }
                    },
                },
                {
                    path: "insurances",
                    populate: [
                        {
                            path: "insurer",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "broker",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "insuredParty",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "reInsured",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "underWriter",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                    ],
                },
            ]
        })
        .populate({
            path: "keyParties",
            select: ['parties'],
            populate: {
                path: "parties",
                populate: [
                    {
                        path: 'type'
                    },
                    {
                        path: 'name',
                        select: ['details'],
                        populate: {
                            path: 'details',
                            select: ['name']
                        }
                    },
                ]
            }
        })
        .populate({
            path: "documentFlow"
        })
        .populate({
            path: "fundFlow",
            populate: [
                {
                    path: "lettersOfCredit",
                    populate: [
                        {
                            path: "applicant",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "issuingBank",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "beneficiary",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "advisingBank",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "confirmingBank",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "negotiatingBank",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "secondBeneficiary",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "reimbursingBank",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                    ]
                },
                {
                    path: 'paymentOrigin',
                    select: ['name']
                },
                {
                    path: 'beneficiary',
                    select: ['details'],
                    populate: {
                        path: 'details',
                        select: ['name']
                    }
                },
                {
                    path: 'payer',
                    select: ['details'],
                    populate: {
                        path: 'details',
                        select: ['name']
                    }
                },
            ]
        })
        .populate({
            path: "facility",
            populate: {
                path: 'currencyHedgeDetails',
                populate: {
                    path: 'counterParty',
                    select: ['details'],
                    populate: {
                        path: 'details',
                        select: ['name']
                    }
                }
            }
        })
        .sort({ name: 1 }).exec();
}
Schema.statics.getAllBySearch = async function (search) {
    return await this.find({ name: { $in: [new RegExp(`.*${search}.*`, 'gi')] }, isDeleted: false })
        .populate({
            path: "details",
            populate: [
                {
                    path: 'productDetails',
                    populate: {
                        path: "name",
                        select: ['name']
                    },
                },
                {
                    path: 'shippingOptions',
                    populate: [
                        {
                            path: "destinationCountry",
                            select: ['name']
                        },
                        {
                            path: "destinationPort",
                            select: ['name']
                        },
                        {
                            path: "countryOfOrigin",
                            select: ['name']
                        },
                        {
                            path: "portOfOrigin",
                            select: ['name']
                        },
                        {
                            path: "warehouses",
                            populate: [
                                {
                                    path: 'warehouseCompany',
                                    select: ['details'],
                                    populate: {
                                        path: 'details',
                                        select: ['name']
                                    }
                                },
                                {
                                    path: 'warehouse',
                                    select: ['name']
                                },
                            ]
                        },
                    ],
                },
                {
                    path: 'transShipmentOptions',
                    populate: {
                        path: "country",
                        select: ['name']
                    },
                },
                {
                    path: "shippingOptions",
                    populate: {
                        path: "shippingCompany",
                        select: ['details'],
                        populate: {
                            path: 'details',
                            select: ['name']
                        }
                    },
                },
                {
                    path: "pricingDetails",
                    populate: {
                        path: "pricingCounterParty",
                        select: ['details'],
                        populate: {
                            path: 'details',
                            select: ['name']
                        }
                    },
                },
                {
                    path: "insurances",
                    populate: [
                        {
                            path: "insurer",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "broker",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "insuredParty",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "reInsured",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "underWriter",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                    ],
                },
            ]
        })
        .populate({
            path: "keyParties",
            select: ['parties'],
            populate: {
                path: "parties",
                populate: [
                    {
                        path: 'type'
                    },
                    {
                        path: 'name',
                        select: ['details'],
                        populate: {
                            path: 'details',
                            select: ['name']
                        }
                    },
                ]
            }
        })
        .populate({
            path: "documentFlow"
        })
        .populate({
            path: "fundFlow",
            populate: [
                {
                    path: "lettersOfCredit",
                    populate: [
                        {
                            path: "applicant",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "issuingBank",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "beneficiary",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "advisingBank",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "confirmingBank",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "negotiatingBank",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "secondBeneficiary",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "reimbursingBank",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                    ]
                },
                {
                    path: 'paymentOrigin',
                    select: ['name']
                },
                {
                    path: 'beneficiary',
                    select: ['details'],
                    populate: {
                        path: 'details',
                        select: ['name']
                    }
                },
                {
                    path: 'payer',
                    select: ['details'],
                    populate: {
                        path: 'details',
                        select: ['name']
                    }
                },
            ]
        })
        .populate({
            path: "facility",
            populate: {
                path: 'currencyHedgeDetails',
                populate: {
                    path: 'counterParty',
                    select: ['details'],
                    populate: {
                        path: 'details',
                        select: ['name']
                    }
                }
            }
        }).sort({ name: 1 });
}

Schema.statics.getById = async function (id) {
    return await this.findOne({ _id: id, isDeleted: false })
        .populate({
            path: "details",
            populate: [
                {
                    path: 'productDetails',
                    populate: {
                        path: "name",
                        select: ['name']
                    },
                },
                {
                    path: 'shippingOptions',
                    populate: [
                        {
                            path: "destinationCountry",
                            select: ['name']
                        },
                        {
                            path: "destinationPort",
                            select: ['name']
                        },
                        {
                            path: "countryOfOrigin",
                            select: ['name']
                        },
                        {
                            path: "portOfOrigin",
                            select: ['name']
                        },
                        {
                            path: "destinationAirbase",
                            select: ['name']
                        },
                        {
                            path: "airbaseOfOrigin",
                            select: ['name']
                        },
                        {
                            path: "warehouses",
                            populate: [
                                {
                                    path: 'warehouseCompany',
                                    select: ['details'],
                                    populate: {
                                        path: 'details',
                                        select: ['name']
                                    }
                                },
                                {
                                    path: 'warehouse',
                                    select: ['name']
                                },
                            ]
                        },
                    ],
                },
                {
                    path: 'transShipmentOptions',
                    populate: {
                        path: "country",
                        select: ['name']
                    },
                },
                {
                    path: "shippingOptions",
                    populate: {
                        path: "shippingCompany",
                        select: ['details'],
                        populate: {
                            path: 'details',
                            select: ['name']
                        }
                    },
                },
                {
                    path: "pricingDetails",
                    populate: {
                        path: "pricingCounterParty",
                        select: ['details'],
                        populate: {
                            path: 'details',
                            select: ['name']
                        }
                    },
                },
                {
                    path: "insurances",
                    populate: [
                        {
                            path: "insurer",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "broker",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "insuredParty",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "reInsured",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "underWriter",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                    ],
                },
            ]
        })
        .populate({
            path: "keyParties",
            select: ['parties', 'relatedParties'],
            populate: [{
                path: "parties",
                populate: [
                    {
                        path: 'type'
                    },
                    {
                        path: 'name',
                        select: ['details'],
                        populate: {
                            path: 'details',
                            select: ['name','givenName']
                        }
                    },
                ]
            },
            {
                path: "relatedParties",
                select: ['party_relation', 'buyer', 'details','upload_evidence']
            }
            ]
        })
        .populate({
            path: "documentFlow"
        })
        .populate({
            path: "fundFlow",
            populate: [
                {
                    path: "lettersOfCredit",
                    populate: [
                        {
                            path: "applicant",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "issuingBank",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "beneficiary",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "advisingBank",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "confirmingBank",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "negotiatingBank",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "secondBeneficiary",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "reimbursingBank",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                    ]
                },
                {
                    path: 'paymentOrigin',
                    select: ['name']
                },
                {
                    path: 'beneficiary',
                    select: ['details'],
                    populate: {
                        path: 'details',
                        select: ['name']
                    }
                },
                {
                    path: 'payer',
                    select: ['details'],
                    populate: {
                        path: 'details',
                        select: ['name']
                    }
                },
            ]
        })
        .populate({
            path: "facility",
            populate: {
                path: 'currencyHedgeDetails',
                populate: {
                    path: 'counterParty',
                    select: ['details'],
                    populate: {
                        path: 'details',
                        select: ['name']
                    }
                }
            }
        }).exec();
}
Schema.statics.getByUserId = async function (userId) {
    return await this.find({ userId: userId, isDeleted: false })
        .populate({
            path: "details",
            populate: [
                {
                    path: 'productDetails',
                    populate: {
                        path: "name",
                        select: ['name']
                    },
                },
                {
                    path: 'shippingOptions',
                    populate: [
                        {
                            path: "destinationCountry",
                            select: ['name']
                        },
                        {
                            path: "destinationPort",
                            select: ['name']
                        },
                        {
                            path: "countryOfOrigin",
                            select: ['name']
                        },
                        {
                            path: "portOfOrigin",
                            select: ['name']
                        },
                        {
                            path: "destinationAirbase",
                            select: ['name']
                        },
                        {
                            path: "airbaseOfOrigin",
                            select: ['name']
                        },
                        {
                            path: "warehouses",
                            populate: [
                                {
                                    path: 'warehouseCompany',
                                    select: ['details'],
                                    populate: {
                                        path: 'details',
                                        select: ['name']
                                    }
                                },
                                {
                                    path: 'warehouse',
                                    select: ['name']
                                },
                            ]
                        },
                    ],
                },
                {
                    path: 'transShipmentOptions',
                    populate: {
                        path: "country",
                        select: ['name']
                    },
                },
                {
                    path: "shippingOptions",
                    populate: {
                        path: "shippingCompany",
                        select: ['details'],
                        populate: {
                            path: 'details',
                            select: ['name']
                        }
                    },
                },
                {
                    path: "pricingDetails",
                    populate: {
                        path: "pricingCounterParty",
                        select: ['details'],
                        populate: {
                            path: 'details',
                            select: ['name']
                        }
                    },
                },
                {
                    path: "insurances",
                    populate: [
                        {
                            path: "insurer",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "broker",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "insuredParty",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "reInsured",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "underWriter",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                    ],
                },
            ]
        })
        .populate({
            path: "keyParties",
            select: ['parties'],
            populate: {
                path: "parties",
                populate: [
                    {
                        path: 'type'
                    },
                    {
                        path: 'name',
                        select: ['details'],
                        populate: {
                            path: 'details',
                            select: ['name']
                        }
                    },
                ]
            }
        })
        .populate({
            path: "documentFlow"
        })
        .populate({
            path: "fundFlow",
            populate: [
                {
                    path: "lettersOfCredit",
                    populate: [
                        {
                            path: "applicant",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "issuingBank",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "beneficiary",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "advisingBank",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "confirmingBank",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "negotiatingBank",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "secondBeneficiary",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "reimbursingBank",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                    ]
                },
                {
                    path: 'paymentOrigin',
                    select: ['name']
                },
                {
                    path: 'beneficiary',
                    select: ['details'],
                    populate: {
                        path: 'details',
                        select: ['name']
                    }
                },
                {
                    path: 'payer',
                    select: ['details'],
                    populate: {
                        path: 'details',
                        select: ['name']
                    }
                },
            ]
        })
        .populate({
            path: "facility",
            populate: {
                path: 'currencyHedgeDetails',
                populate: {
                    path: 'counterParty',
                    select: ['details'],
                    populate: {
                        path: 'details',
                        select: ['name']
                    }
                }
            }
        }).exec();
}

Schema.statics.updateTransaction = async function (data, id) {
    return await this.findOneAndUpdate({
        _id: id
    }, {
        $set: data
    }, {
        new: true
    })
}

Schema.statics.deleteTransaction = async function (id) {
    return await this.findOneAndUpdate({
        _id: id
    }, {
        $set: {
            isDeleted: true
        }
    }, {
        new: true
    })

}

Schema.statics.getTransactionsFromArrayOfIds = async function (ids) {
    return await this.find({
        '_id': { $in: ids }
    })
        .populate({
            path: "details",
            populate: [
                {
                    path: 'productDetails',
                    populate: {
                        path: "name",
                        select: ['name']
                    },
                },
                {
                    path: 'shippingOptions',
                    populate: [
                        {
                            path: "destinationCountry",
                            select: ['name']
                        },
                        {
                            path: "destinationPort",
                            select: ['name']
                        },
                        {
                            path: "countryOfOrigin",
                            select: ['name']
                        },
                        {
                            path: "portOfOrigin",
                            select: ['name']
                        },
                        {
                            path: "destinationAirbase",
                            select: ['name']
                        },
                        {
                            path: "airbaseOfOrigin",
                            select: ['name']
                        },
                    
                        {
                            path: "warehouses",
                            populate: [
                                {
                                    path: 'warehouseCompany',
                                    select: ['details'],
                                    populate: {
                                        path: 'details',
                                        select: ['name']
                                    }
                                },
                                {
                                    path: 'warehouse',
                                    select: ['name']
                                },
                            ]
                        },
                    ],
                },
                {
                    path: 'transShipmentOptions',
                    populate: {
                        path: "country",
                        select: ['name']
                    },
                },
                {
                    path: "shippingOptions",
                    populate: {
                        path: "shippingCompany",
                        select: ['details'],
                        populate: {
                            path: 'details',
                            select: ['name']
                        }
                    },
                },
                {
                    path: "pricingDetails",
                    populate: {
                        path: "pricingCounterParty",
                        select: ['details'],
                        populate: {
                            path: 'details',
                            select: ['name']
                        }
                    },
                },
                {
                    path: "insurances",
                    populate: [
                        {
                            path: "insurer",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "broker",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "insuredParty",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "reInsured",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "underWriter",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                    ],
                },
            ]
        })
        .populate({
            path: "keyParties",
            select: ['parties'],
            populate: {
                path: "parties",
                populate: [
                    {
                        path: 'type'
                    },
                    {
                        path: 'name',
                        select: ['details'],
                        populate: {
                            path: 'details',
                            select: ['name']
                        }
                    },
                ]
            }
        })
        .populate({
            path: "documentFlow"
        })
        .populate({
            path: "fundFlow",
            populate: [
                {
                    path: "lettersOfCredit",
                    populate: [
                        {
                            path: "applicant",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "issuingBank",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "beneficiary",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "advisingBank",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "confirmingBank",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "negotiatingBank",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "secondBeneficiary",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                        {
                            path: "reimbursingBank",
                            select: ['details'],
                            populate: {
                                path: 'details',
                                select: ['name']
                            }
                        },
                    ]
                },
                {
                    path: 'paymentOrigin',
                    select: ['name']
                },
                {
                    path: 'beneficiary',
                    select: ['details'],
                    populate: {
                        path: 'details',
                        select: ['name']
                    }
                },
                {
                    path: 'payer',
                    select: ['details'],
                    populate: {
                        path: 'details',
                        select: ['name']
                    }
                },
            ]
        })
        .populate({
            path: "facility",
            populate: {
                path: 'currencyHedgeDetails',
                populate: {
                    path: 'counterParty',
                    select: ['details'],
                    populate: {
                        path: 'details',
                        select: ['name']
                    }
                }
            }
        })

}

module.exports = mongoose.model("Transaction", Schema)