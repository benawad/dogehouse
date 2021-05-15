import * as text from './types/text';
import * as block from './types/block';
import * as mention from './types/mention';
import * as emote from './types/emote';
import * as link from './types/link';
import * as emoji from './types/emoji';

export interface Unitoken {
	text?: string
	block?: string
	mention?: string,
	emote?: string,
	link?: string,
}

export default {
	text: text.default,
	block: block.default,
	mention: mention.default,
	emote: emote.default,
	emoji: emoji.default,
	link: link.default
};
