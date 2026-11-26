import { Animation } from "~/modules/ui/text/animation.ts";

export const CHARS = "abcdefghijklmnopqrstuvwxyz/@~ ><:";

export type Lines =
	| [
			string | undefined | null,
			string | undefined | null,
			string | undefined | null,
	  ]
	| [string | undefined | null, string | undefined | null]
	| [string | undefined | null]
	| []
	| null
	| undefined;

const teletype = document.querySelector("#lines")!;
const elements = teletype.querySelectorAll("li")!;

export const animate = (idx: number, text?: string | null, drag?: number) => {
	const instances = [
		new Animation(elements.item(0), CHARS),
		new Animation(elements.item(1), CHARS),
		new Animation(elements.item(2), CHARS),
	];
	const changed = [false, false, false];

	if (changed[idx] === false) {
		elements.item(idx).innerText = "";
		changed[idx] = true;
	}
	instances[idx]!.setText(text ?? "", drag ?? 15);
};
