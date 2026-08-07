export const feLessons = [
  {
    id: "subject-b-trace-basics",
    number: 1,
    subject: "B",
    domain: "プログラムの基本要素",
    title: "代入と繰返しを追跡する",
    summary: "擬似言語を1行ずつ読み、変数がどの順番で変化するかを表にして確認します。",
    objectives: [
      "代入記号「←」の右辺と左辺を正しい順序で読める",
      "繰返し処理を1回ずつ区切って、変数の変化を追跡できる",
      "配列の値と累積値を表に整理し、途中時点の値を判断できる",
    ],
    outline: [
      { id: "assignment", label: "代入の向きを読む", description: "右辺を計算してから左辺へ値を入れる。" },
      { id: "loop", label: "繰返しを1回ずつ分ける", description: "何回目の処理かを固定して読む。" },
      { id: "trace", label: "変数の変化を表にする", description: "処理前と処理後の値を並べる。" },
      { id: "checkpoints", label: "読み違いを防ぐ", description: "添字・初期値・更新式を最後に確認する。" },
    ],
    sections: [
      {
        id: "assignment",
        kicker: "Step 1",
        title: "代入は「右を計算して左へ入れる」",
        blocks: [
          {
            type: "paragraph",
            text: "擬似言語の「total ← total ＋ data[i]」は、右辺の「total ＋ data[i]」を先に計算し、その結果を左辺のtotalへ代入します。同じ変数名が左右にあっても、右辺では更新前の値を使います。",
          },
          {
            type: "note",
            text: "読む順序は「右辺を評価する → 左辺へ代入する」です。矢印の向きだけでなく、更新前と更新後の値を分けて考えます。",
          },
        ],
      },
      {
        id: "loop",
        kicker: "Step 2",
        title: "繰返しは1回ずつ止めて読む",
        blocks: [
          {
            type: "paragraph",
            text: "次の例では、配列dataの値を先頭から順番にtotalへ加えます。この例では配列の1番目から3番目を使います。まず初期値を確認し、その後はiが1、2、3の各回で何が変わるかを追います。",
          },
          {
            type: "code",
            language: "pseudocode",
            text: "整数型: total, i\ntotal ← 0\nfor (i を 1 から 3 まで 1 ずつ増やす)\n  total ← total ＋ data[i]\nendfor",
          },
          {
            type: "note",
            text: "dataの内容を [3, 5, 2] として追跡します。繰返しの途中でtotalだけを暗算せず、iとdata[i]も同じ行に書き出します。",
          },
        ],
      },
      {
        id: "trace",
        kicker: "Step 3",
        title: "処理前と処理後を表で分ける",
        blocks: [
          {
            type: "paragraph",
            text: "更新式がある問題では、処理前の値と処理後の値を同じ列に混ぜないことが重要です。1回分の処理を終えてから次の行へ進むと、途中値を取り違えにくくなります。",
          },
          {
            type: "table",
            caption: "data = [3, 5, 2] の追跡例",
            headers: ["i", "data[i]", "処理前 total", "処理後 total"],
            rows: [
              ["1", "3", "0", "3"],
              ["2", "5", "3", "8"],
              ["3", "2", "8", "10"],
            ],
          },
          {
            type: "paragraph",
            text: "例えばi = 2の回では、処理前のtotalは3です。そこへdata[2]の5を加えるため、処理後のtotalは8になります。",
          },
        ],
      },
      {
        id: "checkpoints",
        kicker: "Step 4",
        title: "最後に4点を確認する",
        blocks: [
          {
            type: "list",
            items: [
              "初期値は何か",
              "繰返しはどこからどこまで実行するか",
              "配列のどの要素を参照するか",
              "更新式の右辺で使う値は更新前か更新後か",
            ],
          },
          {
            type: "note",
            text: "途中値を問われた場合は、最後まで実行する必要はありません。指定された回まで表を埋め、その時点の処理後の値を答えます。",
          },
        ],
      },
    ],
    check: {
      prompt: "data = [3, 5, 2] のとき、i = 2 の繰返し処理が終わった直後の total はどれですか。",
      choices: [
        { id: "a", label: "3" },
        { id: "b", label: "5" },
        { id: "c", label: "8" },
        { id: "d", label: "10" },
      ],
      correctChoiceId: "c",
      explanation: "i = 1 の終了時点で total は3です。i = 2 では data[2] の5を加えるため、3 ＋ 5 = 8 になります。",
    },
  },
];

export function getFeLessonById(id) {
  return feLessons.find((lesson) => lesson.id === id) || null;
}

export function validateFeLessonDefinition(lesson) {
  const errors = [];
  if (!lesson?.id) errors.push("lesson id is required");
  if (!Number.isInteger(lesson?.number) || lesson.number < 1) errors.push("lesson number must be a positive integer");
  if (!lesson?.title) errors.push("lesson title is required");
  if (!Array.isArray(lesson?.objectives) || lesson.objectives.length < 2) errors.push("lesson objectives are required");
  if (!Array.isArray(lesson?.outline) || lesson.outline.length < 2) errors.push("lesson outline is required");
  if (!Array.isArray(lesson?.sections) || lesson.sections.length < 2) errors.push("lesson sections are required");

  const sectionIds = new Set((lesson?.sections || []).map((section) => section.id));
  for (const step of lesson?.outline || []) {
    if (!sectionIds.has(step.id)) errors.push(`outline step has no section: ${step.id}`);
  }

  const choices = lesson?.check?.choices || [];
  const choiceIds = new Set(choices.map((choice) => choice.id));
  if (!lesson?.check?.prompt || choices.length < 2) errors.push("knowledge check is incomplete");
  if (choiceIds.size !== choices.length) errors.push("knowledge check choice ids must be unique");
  if (!choiceIds.has(lesson?.check?.correctChoiceId)) errors.push("knowledge check correct choice is missing");
  if (!lesson?.check?.explanation) errors.push("knowledge check explanation is required");

  return errors;
}
