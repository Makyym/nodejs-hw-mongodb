import { SORT_ORDER } from "../constants/index.js";
import { ContactsCollection } from "../db/models/contact.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";

export const getAllContacts = async ({
    page = 1,
    perPage = 10,
    sortOrder = SORT_ORDER.ASC,
    sortBy = '_id',
    filter = {},
}) => {
    const limit = perPage;
    const skip = (page - 1) * perPage;

    const contactsQuery = ContactsCollection.find();

    if(filter.type) {
        contactsQuery.where('contactType').equals(filter.type);
    };

    if(filter.isFavourite) {
        contactsQuery.where('isFavourite').equals(filter.isFavourite);
    };

    const contactsCount = ContactsCollection.find()
    .merge(contactsQuery)
    .countDocuments();

    const contactsData = contactsQuery.skip(skip)
    .limit(limit)
    .sort({[sortBy]: sortOrder})
    .exec();
    
    const [contacts, contactsQueryData] = await Promise.all([
        contactsData,
        contactsCount,
    ]);
    const paginationData = calculatePaginationData(contactsQueryData, perPage, page);
    return {
        data: contacts,
        ...paginationData,
    };
};

export const getContactById = async (contactId) => {
    const contact = await ContactsCollection.findById(contactId);
    return contact;
};

export const createContact = async (payload) => {
    const contact = await ContactsCollection.create(payload);
    return contact;
};

export const updateContact = async (contactId, payload, options = {}) => {
    const rawContact = await ContactsCollection.findByIdAndUpdate(
        { _id: contactId},
        payload,
        {
            new: true,
            includeResultMetadata: true,
            ...options,
        },
    );
    if (!rawContact || !rawContact.value) return null;

    return {
        contact: rawContact.value,
        isNew: Boolean(rawContact?.lastErrorObject?.upserted),
    };
};

export const deleteContact = async (contactId) => {
    const contact = await ContactsCollection.findByIdAndDelete({
        _id: contactId,
    });
    return contact;
};