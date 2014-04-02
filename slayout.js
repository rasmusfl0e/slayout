var core = require("./slayout-core");

module.exports = function (less, args) {
	if ("value" in args && Array.isArray(args.value)) {
		var data = args.value.map(function (queryData, index) {
			return {
				query: queryData.value[0].value,
				width: queryData.value[2].value,
				blocks: queryData.value[1].value.map(function (block) {
					return block.value;
				})
			};
		});

		data = core(data);
	}
	else {
		throw ("slayout failed: expected a Less object");
	}
	return new (less.tree.Dimension)(args.value.length);
};

/*
var layouts = [
	{
		query: "",
		width: 12,
		blocks: [6, 6]
	},
	{

	}
];
*/