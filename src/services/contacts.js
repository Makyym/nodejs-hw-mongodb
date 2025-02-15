import { SORT_ORDER } from "../constants/index.js";
import { ContactsCollection } from "../db/models/contact.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";

export const getAllContacts = async ({
    page = 1,
    perPage = 10,
    sortOrder = SORT_ORDER.ASC,
    sortBy = '_id',
    filter = {},
    userId,
}) => {
    const limit = perPage;
    const skip = (page - 1) * perPage;

    const contactsQuery = ContactsCollection.find({userId});

    if(filter.type) {
        contactsQuery.where('contactType').equals(filter.type);
    };

    if(filter.isFavourite) {
        contactsQuery.where('isFavourite').equals(filter.isFavourite);
    };

    const contactsCount = ContactsCollection.find({userId})
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

export const getContactById = async (contactId, userId) => {
    const contact = await ContactsCollection.findOne({
        _id: contactId,
        userId});
    return contact;
};

export const createContact = async (payload) => {
    const contact = await ContactsCollection.create(payload);
    return contact;
};

export const updateContact = async (userId, contactId, payload, options = {}) => {
    const rawContact = await ContactsCollection.findOneAndUpdate(
        { _id: contactId,
            userId
        },
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

export const deleteContact = async (userId, contactId) => {
    const contact = await ContactsCollection.findOneAndDelete({
        userId,
        _id: contactId,
    });
    return contact;
};