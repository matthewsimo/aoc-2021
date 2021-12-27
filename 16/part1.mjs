import rawInput from "./input.mjs";

// console.log(rawInput);

const hexToBinMap = {
  0: "0000",
  1: "0001",
  2: "0010",
  3: "0011",
  4: "0100",
  5: "0101",
  6: "0110",
  7: "0111",
  8: "1000",
  9: "1001",
  A: "1010",
  B: "1011",
  C: "1100",
  D: "1101",
  E: "1110",
  F: "1111",
};

const getBin = (hexDigit) => hexToBinMap[hexDigit];

const input = rawInput
  .split("")
  .map((v) => getBin(v))
  .join("");

// console.log(input);

const parseLiteral = (value) => {
  // console.log(`PARSE LITERAL`);
  // console.log({ value });
  let values = [];
  let lastGroupFound = false;
  let rest;
  for (let i = 0; i < Math.floor(value.length / 5); i++) {
    const bits = value.slice(i * 5, i * 5 + 5);
    // console.log({ i, bits });
    if (!lastGroupFound) {
      if (bits.startsWith("0")) {
        lastGroupFound = true;
        rest = value.slice(i * 5 + 5);
      }
      values.push(bits.slice(1));
    }
  }

  // console.log({ values: values.join(""), rest });
  return [values.join(""), rest];
};

// parsePacketOld(input);

const parseOperator = (operatorType, rawOperator) => {
  const operator = {
    operatorType,
    rawOperator,
    subPackets: [],
  };

  if (operatorType === "0") {
    const subPacketLengthRaw = rawOperator.slice(0, 15);
    const subPacketLength = parseInt(subPacketLengthRaw, 2);

    operator.lengthRaw = subPacketLengthRaw;
    operator.length = subPacketLength;
    const subPacketsRaw = rawOperator.slice(15, 15 + subPacketLength);
    operator.subPacketsRaw = subPacketsRaw;
    operator.remaining = rawOperator.slice(15 + subPacketLength);

    const subPacketA = parsePacket(subPacketsRaw);
    operator.subPackets.push(subPacketA);

    if (subPacketA.remaining !== "") {
      const subPacketB = parsePacket(subPacketA.remaining);
      operator.subPackets.push(subPacketB);
    }
    // console.log({ subPacketB });
  } else if (operatorType === "1") {
    const subPacketNumberRaw = rawOperator.slice(0, 11);
    const subPacketNumber = parseInt(subPacketNumberRaw, 2);
    operator.subPacketCountRaw = subPacketNumberRaw;
    operator.subPacketCount = subPacketNumber;
    const subPacketsRaw = rawOperator.slice(11);
    operator.subPacketsRaw = subPacketsRaw;

    let remaining = subPacketsRaw;
    for (let i = 0; i < subPacketNumber; i++) {
      // console.log("for loop pass: ", i, subPacketNumber, remaining);
      if (remaining !== "") {
        const parsedSubPacket = parsePacket(remaining);
        // console.log(parsedSubPacket);
        operator.subPackets.push(parsedSubPacket);
        remaining = parsedSubPacket.remaining;
      }
    }

    operator.remaining = remaining;
  }

  // console.log(JSON.stringify(operator, null, 2));

  return operator;
};

const parsePacket = (packet) => {
  console.log(`Parse Packet:`, packet);

  const version = parseInt(packet.slice(0, 0 + 3), 2);
  const typeId = parseInt(packet.slice(3, 3 + 3), 2);

  const parsedPacket = {
    versionTally: version,
    version,
    typeId,
  };

  if (typeId === 4) {
    const [value, rest] = parseLiteral(packet.slice(6));
    parsedPacket.value = value;
    parsedPacket.remaining = rest;
  } else {
    const lengthTypeId = packet.slice(6, 7);
    const rest = packet.slice(7);
    const operatorPacket = parseOperator(lengthTypeId, rest);
    parsedPacket.operator = operatorPacket;

    operatorPacket.subPackets.forEach((subPacket) => {
      parsedPacket.versionTally += subPacket.versionTally;
    });
    parsedPacket.remaining = operatorPacket.remaining;
  }

  return parsedPacket;
};

const parsedPacket = parsePacket(input);
console.log(JSON.stringify(parsedPacket, null, 2));
console.log(parsedPacket.versionTally);
