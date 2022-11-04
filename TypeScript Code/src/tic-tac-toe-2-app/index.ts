import { href, id, title } from "@juniper-lib/dom/attrs";
import { onClick } from "@juniper-lib/dom/evts";
import { A, ButtonSecondary, buttonSetEnabled, Div, elementApply, ErsatzElement, H1, P } from "@juniper-lib/dom/tags";

import "./styles.css";

type Side = 'X' | 'O';
type CellState = '.' | Side;
type LineState = "win" | "lose" | "winning" | "losing" | "good" | "bad" | "blocked" | "full" | "empty";

type Grid<T = CellState> = [
    [T, T, T],
    [T, T, T],
    [T, T, T]
];

function endMessage(msg: string) {
    alert(msg);
    location.reload();
}

function createEmptyGrid(): Grid {
    return [
        ['.', '.', '.'],
        ['.', '.', '.'],
        ['.', '.', '.']
    ];
}

class BoardState {
    private readonly grid: Grid;

    constructor(grid: Grid = null) {
        this.grid = grid || createEmptyGrid();
    }

    clone(): Grid {
        const grid = createEmptyGrid();
        for (let y = 0; y < 3; ++y) {
            for (let x = 0; x < 3; ++x) {
                grid[y][x] = this.grid[y][x];
            }
        }

        return grid;
    }

    cell(x: number, y: number): CellState {
        return this.grid[y][x];
    }

    free(x: number, y: number): boolean {
        return this.cell(x, y) === '.';
    }

    private line(n: number, side: Side, getState: (a: number, b: number) => CellState): LineState {
        const counts = new Map<CellState, number>([
            ['.', 0],
            ['X', 0],
            ['O', 0]
        ]);
        for (let i = 0; i < 3; ++i) {
            const state = getState(i, n);
            counts.set(state, counts.get(state) + 1);
        }

        const emptys = counts.get('.');
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

    row(y: number, side: Side): LineState {
        return this.line(y, side, (x, y) => this.cell(x, y));
    }

    col(x: number, side: Side): LineState {
        return this.line(x, side, (y, x) => this.cell(x, y));
    }

    diag(n: number, side: Side): LineState {
        if (n === 2) {
            return "empty";
        }

        const getState = n === 0
            ? (i: number) => this.cell(i, i)
            : (i: number) => this.cell(i, 2 - i);

        return this.line(null, side, getState);
    }


    play(x: number, y: number, side: Side): BoardState {
        const grid = this.clone();
        grid[y][x] = side;
        return new BoardState(grid);
    }
}

class Board implements ErsatzElement {
    readonly element: Element;

    private readonly buttons: Grid<HTMLButtonElement>;

    private state: BoardState;

    constructor() {
        this.buttons = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];

        for (let y = 0; y < 3; ++y) {
            for (let x = 0; x < 3; ++x) {
                this.buttons[y][x] = ButtonSecondary(
                    '.',
                    title("Play here"),
                    onClick(() => this.select(x, y))
                );
            }
        }

        this.element = Div(
            id("board"),
            ...this.buttons.flatMap(r => r)
        );

        this.state = new BoardState();
        this.render();
    }

    select(x: number, y: number) {

        this.play(x, y, 'X');

        for (let i = 0; i < 3; ++i) {
            const row = this.state.row(i, 'X');
            const col = this.state.col(i, 'X');
            const diag = this.state.diag(i, 'X');
            if (row === "win"
                || col === "win"
                || diag === "win") {
                endMessage("You won!");
                return;
            }
            else if (row === "lose"
                || col === "lose"
                || diag === "lose") {
                endMessage("You lost!");
                return;
            }
            else if (row === "winning"
                || row === "losing") {
                for (let n = 0; n < 3; ++n) {
                    if (this.state.free(n, i)) {
                        this.play(n, i, 'O');
                        return;
                    }
                }
            }
            else if (col === "winning"
                || col === "losing") {
                for (let n = 0; n < 3; ++n) {
                    if (this.state.free(i, n)) {
                        this.play(i, n, 'O');
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
                    if (this.state.free(x, y)) {
                        this.play(x, y, 'O');
                        return;
                    }
                }
            }
        }

        if (this.state.free(1, 1)) {
            this.play(1, 1, 'O');
            return;
        }


        for (let i = 0; i < 3; ++i) {
            const row = this.state.row(i, 'X');
            const col = this.state.col(i, 'X');
            const diag = this.state.diag(i, 'X');
            if (row === "good"
                || row === "bad") {
                for (let n = 0; n < 3; ++n) {
                    if (this.state.free(n, i)) {
                        this.play(n, i, 'O');
                        return;
                    }
                }
            }
            else if (col === "good"
                || col === "bad") {
                for (let n = 0; n < 3; ++n) {
                    if (this.state.free(i, n)) {
                        this.play(i, n, 'O');
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
                    if (this.state.free(x, y)) {
                        this.play(x, y, 'O');
                        return;
                    }
                }
            }
        }

        for (let x = 0; x < 3; ++x) {
            for (let y = 0; y < 3; ++y) {
                if (this.state.free(x, y)) {
                    this.play(x, y, 'O');
                    return;
                }
            }
        }

        endMessage("It's a tie!");
        return;
    }

    private play(x: number, y: number, side: Side) {
        this.state = this.state.play(x, y, side);
        this.render();
    }

    private render() {
        for (let y = 0; y < 3; ++y) {
            for (let x = 0; x < 3; ++x) {
                if (this.state.free(x, y)) {
                    buttonSetEnabled(this.buttons[y][x], true, '.', "Play here!");
                }
                else {
                    const side = this.state.cell(x, y);
                    buttonSetEnabled(this.buttons[y][x], false, side, `${side} has played here`);
                }
            }
        }
    }
}

let board = new Board();

elementApply("main",
    H1("Tic Tac Toe 2"),
    P("This is a refinement of ", A(href("tic-tac-toe-1"), "Tic Tac Toe 1"), ". It converts the board implementation into an object-oriented design with a separate, immutable state object."),
    P("Code is available ", A(href("https://github.com/capnmidnight/seanmcbeth.com/blob/master/TypeScript%20Code/src/tic-tac-toe-2-app/index.ts"), "here")),
    board,
    P(
        "< ", A(href("tic-tac-toe-1"), "1")
    ));