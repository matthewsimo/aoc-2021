const std = @import("std");
const print = std.debug.print;
const debug = std.log.debug;

pub fn main() anyerror!void {
    const input = @embedFile("../input.txt");

    std.log.info(input, .{});

    // var line = "";
    // for (input) |char, index| {
    //     // debug("{c} {d}", .{ char, index });
    //     if (char != '\n') {
    //         line = std.mem.concat(line, char);
    //         debug("{c} {s} {d} {s}", .{ char, "char", index, line });
    //     } else {
    //         line = "";
    //         debug("{c} {s} {d} {s}", .{ char, "break", index, line });
    //     }
    // }

    var i = std.mem.split(u8, input, "\n");
    debug("line: {s}\n", .{i});

    var last: []u8 = "";
    var count: u8 = 0;
    while (i.next()) |line| {
        std.log.debug("last: {s}\nline: {s}\n", .{ last, line });
        if (!std.mem.eql(u8, last, "")) {
            if (line > last) {
                count += 1;
            }
        }

        last = line;
    }
}

test "basic test" {
    try std.testing.expectEqual(10, 3 + 7);
}
