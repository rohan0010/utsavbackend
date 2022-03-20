
const mongoose = require("../connection");
const config = require("../config");
const schema = mongoose.Schema;

const VariantSchema = new schema({
    variantId: { type: String,  required: true },
    variantName: { type: String,  required: true },
    value: [String],
    categoryId:[String]
});

const variants = mongoose.model(config.dbvariant, VariantSchema);

module.exports = variants;