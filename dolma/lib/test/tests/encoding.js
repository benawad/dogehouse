"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = [
    {
        name: "Plain text encoding test 1",
        type: "encode",
        input: "This is a test to make sure that plain text tokens still work, also, https://dogehouse.tv is pretty great!",
        expectedOutput: [
            { t: 'text', v: 'This' },
            { t: 'text', v: 'is' },
            { t: 'text', v: 'a' },
            { t: 'text', v: 'test' },
            { t: 'text', v: 'to' },
            { t: 'text', v: 'make' },
            { t: 'text', v: 'sure' },
            { t: 'text', v: 'that' },
            { t: 'text', v: 'plain' },
            { t: 'text', v: 'text' },
            { t: 'text', v: 'tokens' },
            { t: 'text', v: 'still' },
            { t: 'text', v: 'work,' },
            { t: 'text', v: 'also,' },
            { t: 'link', v: 'https://dogehouse.tv' },
            { t: 'text', v: 'is' },
            { t: 'text', v: 'pretty' },
            { t: 'text', v: 'great!' }
        ]
    },
    {
        name: "Plain text encoding test 2",
        type: "encode",
        input: "I think Ben Awad being on simptok is super funny, but I think he would do better being a simp on dogehouse :reddogehouse:, but https://github.com/ is epic!",
        expectedOutput: [
            { t: 'text', v: 'I' },
            { t: 'text', v: 'think' },
            { t: 'text', v: 'Ben' },
            { t: 'text', v: 'Awad' },
            { t: 'text', v: 'being' },
            { t: 'text', v: 'on' },
            { t: 'text', v: 'simptok' },
            { t: 'text', v: 'is' },
            { t: 'text', v: 'super' },
            { t: 'text', v: 'funny,' },
            { t: 'text', v: 'but' },
            { t: 'text', v: 'I' },
            { t: 'text', v: 'think' },
            { t: 'text', v: 'he' },
            { t: 'text', v: 'would' },
            { t: 'text', v: 'do' },
            { t: 'text', v: 'better' },
            { t: 'text', v: 'being' },
            { t: 'text', v: 'a' },
            { t: 'text', v: 'simp' },
            { t: 'text', v: 'on' },
            { t: 'text', v: 'dogehouse' },
            { t: 'emote', v: 'reddogehouse' },
            { t: 'text', v: ',' },
            { t: 'text', v: 'but' },
            { t: 'link', v: 'https://github.com/' },
            { t: 'text', v: 'is' },
            { t: 'text', v: 'epic!' }
        ]
    },
    {
        name: "Mixed unitoken and strings encoding test 1",
        type: "encode",
        input: ["Dogecoin to the moon!!!", { emote: "CryptoDOGE" }],
        expectedOutput: [
            { t: 'text', v: 'Dogecoin' },
            { t: 'text', v: 'to' },
            { t: 'text', v: 'the' },
            { t: 'text', v: 'moon!!!' },
            { t: 'emote', v: 'CryptoDOGE' }
        ]
    }
];
