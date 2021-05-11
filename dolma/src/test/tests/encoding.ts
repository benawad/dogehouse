export default [
	{
		name: "Single string type test 1 (text)",
		type: "encode",

		input: "Ben Awad",
		expectedOutput: [{ t: 'text', v: 'Ben Awad' }]
	},

	{
		name: "Single string type test 2 (link)",
		type: "encode",

		input: "https://dogehouse.tv",
		expectedOutput: [{ t: 'link', v: 'https://dogehouse.tv' }]
	},

	{
		name: "Single string type test 3 (mention)",
		type: "encode",

		input: "@benawad",
		expectedOutput: [{ t: 'mention', v: 'benawad' }]
	},

	{
		name: "Single string type test 4 (block)",
		type: "encode",

		input: "`Angular.JS is horrible`",
		expectedOutput: [{ t: 'block', v: 'Angular.JS is horrible' }]
	},

	{
		name: "Single string type test 5 (emote)",
		type: "encode",

		input: ":CryptoDOGE:",
		expectedOutput: [{ t: 'emote', v: 'CryptoDOGE' }]
	},

	{
		name: "Plain text encoding test 1",
		type: "encode",

		input: "This is a test to make sure that plain text tokens still work, also, https://dogehouse.tv is pretty great!",
		expectedOutput: [
			{
				t: 'text',
				v: 'This is a test to make sure that plain text tokens still work, also,'
			},
			{ t: 'link', v: 'https://dogehouse.tv' },
			{ t: 'text', v: 'is pretty great!' }
		]
	},

	{
		name: "Plain text encoding test 2",
		type: "encode",

		input: "I think Ben Awad being on simptok is super funny, but I think he would do better being a simp on dogehouse :reddogehouse:, but https://github.com/ is epic!",
		expectedOutput: [
			{
				t: 'text',
				v: 'I think Ben Awad being on simptok is super funny, but I think he would do better being a simp on dogehouse'
			},
			{ t: 'emote', v: 'reddogehouse' },
			{ t: 'text', v: ', but' },
			{ t: 'link', v: 'https://github.com/' },
			{ t: 'text', v: 'is epic!' }
		]
	},

	{
		name: "Mixed unitoken and strings encoding test 1",
		type: "encode",

		input: ["Dogecoin to the moon!!!", { emote: "CryptoDOGE" }],
		expectedOutput: [
			{ t: 'text', v: 'Dogecoin to the moon!!!' },
			{ t: 'emote', v: 'CryptoDOGE' }
		]
	}
];