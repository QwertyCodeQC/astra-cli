import { beforeAll, describe, expect, it } from "vitest";
import nameparse, { generate, isLTS } from "../src/helpers/nameparse.js";
import { isVersionInstalled } from "../src/helpers/cache.js";
import { got } from "got";

beforeAll(async () => {
	try {
		if ((await got("https://api.github.com")).statusCode !== 200) {
			throw new Error(
				"GitHub API is not reachable. Rate limit exceeded or network issue.",
			);
		}
	} catch (error) {
		throw new Error(
			"GitHub API is not reachable. Rate limit exceeded or network issue.",
		);
	}
});

describe("helpers", () => {
	it("should return it's LTS version", async () => {
		await expect(isLTS("node_v22.15.1-win-x64")).resolves.toBe(true);
	}, 15000);

	it("should return it's not LTS version", async () => {
		await expect(isLTS("node_v23.11.1-win-x64")).resolves.toBe(false);
	});

	it("should return valid object", () => {
		expect(nameparse("node_v22.15.1-win-x64")).toEqual({
			arch: "x64",
			os: "win",
			isLTS: false,
			version: "v22.15.1",
		});
	});

	it("should return invalid valid object", () => {
		expect(nameparse("node-win-v22.15.1-x64")).not.toEqual({
			arch: "x64",
			os: "win",
			isLTS: false,
			version: "v22.15.1",
		});
	});

	it("should return valid version string", () => {
		expect(
			generate({
				arch: "x64",
				os: "win",
				isLTS: false,
				version: "v22.15.1",
			}),
		).toEqual("node_v22.15.1-win-x64");
	});

	it("should return version is not installed", () => {
		expect(isVersionInstalled("invalid_version")).toBe(false);
	});
});
