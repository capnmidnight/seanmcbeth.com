import { href, id, title } from "@juniper-lib/dom/attrs";
import { onClick } from "@juniper-lib/dom/evts";
import { A, ButtonSecondary, buttonSetEnabled, Div, elementApply, H1, P } from "@juniper-lib/dom/tags";

import "./styles.css";

const buttons = new Array<HTMLButtonElement>();
for (let i = 0; i < 9; ++i) {
    const x = i % 3;
    const y = Math.floor(i / 3);
    buttons[i] = ButtonSecondary(
        ".",
        title("Play here"),
        onClick(() => select(x, y))
    );
}

elementApply("main",
    H1("Tic Tac Toe 1"),
    P("This was a quick slap-together of a Tic Tac Toe board. I didn't get the AI right."),
    P("Code is available ", A(href("https://github.com/capnmidnight/seanmcbeth.com/blob/master/TypeScript%20Code/src/tic-tac-toe-1-app/index.ts"), "here"), "."),
    Div(
        id("board"),
        ...buttons
    ),
    P(
        "> ", A(href("tic-tac-toe-2"), "2")
    )
);

type Side = "X" | "O";
type CellState = "." | Side;
type LineState = "win" | "lose" | "winning" | "losing" | "good" | "bad" | "blocked" | "full" | "empty";

function btn(x: number, y: number): HTMLButtonElement {
    return buttons[x + 3 * y];
}

function state(btn: HTMLButtonElement): CellState {
    return btn.innerHTML.trim() as CellState;
}

function checkLine(n: number, side: Side, getButton: (a: number, b: number) => HTMLButtonElement): LineState {
    const counts = new Map<CellState, number>([
        [".", 0],
        ["X", 0],
        ["O", 0]
    ]);
    for (let i = 0; i < 3; ++i) {
        const side = state(getButton(i, n));
        counts.set(side, counts.get(side) + 1);
    }

    return evalLine(counts, side);
}

function evalLine(counts: Map<CellState, number>, side: Side): LineState {
    const emptys = counts.get(".");
    const goods = counts.get(side);

    if (emptys === 0) {
        if (goods === 0) {
            return "lose";
        }
        else if (goods === 1 || goods === 2) {
            return "full";
        }
        else {
            return "win";
        }
    }
    else if (emptys === 1) {
        if (goods === 0) {
            return "bad";
        }
        else if (goods === 1) {
            return "blocked";
        }
        else {
            return "winning";
        }
    }
    else if (emptys === 2) {
        if (goods === 0) {
            return "bad";
        }
        else {
            return "good";
        }
    }
    else {
        return "empty";
    }
}

function checkRow(y: number, side: Side): LineState {
    return checkLine(y, side, (x, y) => btn(x, y));
}

function checkColumn(x: number, side: Side): LineState {
    return checkLine(x, side, (y, x) => btn(x, y));
}

function checkDiag(n: number, side: Side): LineState {
    if (n === 2) {
        return "empty";
    }

    const getButton = n === 0
        ? (i: number) => btn(i, i)
        : (i: number) => btn(i, 2 - i);

    return checkLine(null, side, getButton);
}

function isFree(x: number, y: number) {
    return state(btn(x, y)) === ".";
}

function play(x: number, y: number, side: Side) {
    buttonSetEnabled(btn(x, y), false, side, `${side} has played here`);
}

function message(msg: string) {
    alert(msg);
    location.reload();
}

function select(x: number, y: number) {
    play(x, y, "X");

    for (let i = 0; i < 3; ++i) {
        const row = checkRow(i, "X");
        const col = checkColumn(i, "X");
        const diag = checkDiag(i, "X");
        if (row === "win"
            || col === "win"
            || diag === "win") {
            message("You won!");
            return;
        }
        else if (row === "lose"
            || col === "lose"
            || diag === "lose") {
            message("You lost!");
            return;
        }
        else if (row === "winning"
            || row === "losing") {
            for (let n = 0; n < 3; ++n) {
                if (isFree(n, i)) {
                    play(n, i, "O");
                    return;
                }
            }
        }
        else if (col === "winning"
            || col === "losing") {
            for (let n = 0; n < 3; ++n) {
                if (isFree(i, n)) {
                    play(i, n, "O");
                    return;
                }
            }
        }
        else if (diag === "winning"
            || diag === "losing") {
            for (let n = 0; n < 3; ++n) {
                const x = n;
                const y = i === 0
                    ? n
                    : 2 - n;
                if (isFree(x, y)) {
                    play(x, y, "O");
                    return;
                }
            }
        }
    }

    if (isFree(1, 1)) {
        play(1, 1, "O");
        return;
    }


    for (let i = 0; i < 3; ++i) {
        const row = checkRow(i, "X");
        const col = checkColumn(i, "X");
        const diag = checkDiag(i, "X");
        if (row === "good"
            || row === "bad") {
            for (let n = 0; n < 3; ++n) {
                if (isFree(n, i)) {
                    play(n, i, "O");
                    return;
                }
            }
        }
        else if (col === "good"
            || col === "bad") {
            for (let n = 0; n < 3; ++n) {
                if (isFree(i, n)) {
                    play(i, n, "O");
                    return;
                }
            }
        }
        else if (diag === "good"
            || diag === "bad") {
            for (let n = 0; n < 3; ++n) {
                const x = n;
                const y = i === 0
                    ? n
                    : 2 - n;
                if (isFree(x, y)) {
                    play(x, y, "O");
                    return;
                }
            }
        }
    }

    for (let x = 0; x < 3; ++x) {
        for (let y = 0; y < 3; ++y) {
            if (isFree(x, y)) {
                play(x, y, "O");
                return;
            }
        }
    }

    message("It's a tie!");
    return;
}