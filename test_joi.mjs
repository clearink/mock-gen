import joi from "joi";
const schema = joi.object({
  id: joi.valid(1, "a"),
});

console.log(
  schema.validate(
    { id: 'a'},
    { convert: false, allowUnknown: true }
  )
);
