(function(a) {
    a.fn.gsync = function(d) {
        var b = a.extend({
            dbname: "syncdb",
            user_name: "",
            mpwd: "",
            pwd: "",
            verbose: false,
            _myDB: "",
            base_url: "",
            upld_url: "",
            err: "",
            seperator: "\t",
            upload_zerokb: false,
            max_db_size: 2 * 1024 * 1024,
            uploads: [],
            downloads: [],
            raw_data: {},
            ts: [],
            processcmd: [],
            copytbl: [],
            createtbl: [],
            on_complete: null,
            on_notify: null,
            upld_headers: {
                godbencode: "utf-8"
            },
            install_id: "",
            start_time: 0,
            AI: "",
            GV: "16.0",
            BV: "0107",
            BN: "12+12+2012-00:00:00",
            D4S: "",
            CompressSize: ""
        }, d);
        var e = this;
        var c;
        _log = function(h, g) {
            var f = (new Date()).getTime() - b.start_time;
            if (g != null) {
                console.log(h, g)
            } else {
                console.log(f + ":" + h)
            }
        };
        _err = function(g, f) {
            if (f != null) {
                console.error(g, f)
            } else {
                console.error(g)
            }
        };
        _ver = function(f) {
            if (b.verbose) {
                console.log(f)
            }
        };
        a.fn.gsync.start_sync = function() {
            b.start_time = (new Date()).getTime();
            if (b.on_notify != null) {
                b.on_notify("login", "started")
            }
            _log("sync started");
            b.db = b._myDB;
            b.createtbl.push({
                qry: "create table if not exists gsynchelper (tblname varchar(50), recnum int, unique(tblname, recnum) )"
            });
            b.createtbl.push({
                qry: "create table if not exists gsyncTlist (tblname varchar(50), lastupdate  varchar(50), unique(tblname) )"
            });
            b.createtbl.push({
                qry: "create table if not exists gsyncstatus(install_id int, session_id varchar(100), user_id varchar(100) )"
            });
            createTable()
        };
        createTable = function() {
            if (b.createtbl.length != 0) {
                var f = b.createtbl.shift();
                return createTable_Exec(f.qry)
            } else {
                b.err = "";
                b.ts = [];
                b.uploads = [];
                b.downloads = [];
                b.raw_data = {};
                b.processcmd = [];
                b.copytbl = [];
                prepare_for_sync()
            }
        };
        createTable_Exec = function(f) {
            b.db.transaction(function(g) {
                g.executeSql(f, [], function(h) {
                    createTable()
                }, function(h) {
                    console.log(f + " Exec Failed")
                })
            })
        };
        logout = function(g, f) {
            b.err += f;
            if (b.on_notify != null) {
                b.on_notify("logout", g)
            }
            a.ajax({
                type: "POST",
                url: b.base_url,
                data: {
                    A: "LO"
                },
                success: function(h) {
                    _log("logged out\nsync completed");
                    if (b.on_complete != null) {
                        if (c) {
                            b.db.close(function() {
                                console.log("database is closed ok")
                            })
                        }
                        b.on_complete(true, b.err)
                    }
                },
                error: function(j, h, i) {
                    _err("logout failed, sync completed");
                    if (b.on_complete != null) {
                        if (c) {
                            b.db.close(function() {
                                console.log("database is closed ok")
                            })
                        }
                        b.on_complete(false, b.err)
                    }
                },
                dataType: "text"
            })
        };
        prepare_for_sync = function() {
            b.db.transaction(function(f) {
                f.executeSql("select recnum, tblname from gsynchelper", [], function(g, j) {
                    for (var h = 0; h < j.rows.length; h++) {
                        b.ts.push({
                            name: j.rows.item(h).tblname,
                            ts: j.rows.item(h).recnum
                        })
                    }
                });
                f.executeSql("select install_id from gsyncstatus", [], function(g, h) {
                    if (h.rows.length > 0) {
                        b.install_id = h.rows.item(0).install_id
                    }
                })
            }, function(f) {
                login()
            }, function() {
                login()
            })
        };
        login = function() {
            _log("login");
            a.ajax({
                type: "POST",
                url: b.base_url,
                data: {
                    A: "L",
                    D: "webkit",
                    C: b.CompressSize,
                    GV: b.GV,
                    BV: b.BV,
                    BN: b.BN,
                    AI: b.AI,
                    DB: "SQLITE",
                    D4S: b.D4S,
                    U: b.user_name,
                    MP: b.mpwd,
                    P: b.pwd,
                    IID: b.install_id,
                    useutf: 1
                },
                success: function(f) {
                    ajax_success(f, "Login", upload_modified)
                },
                error: function(g, f, h) {
                    ajax_error(f, "Login")
                },
                dataType: "text"
            })
        };
        upload_modified = function() {
            if (b.on_notify != null) {
                b.on_notify("uploads", "started")
            }
            _log("upload");
            a.ajax({
                type: "POST",
                url: b.base_url,
                data: {
                    A: "M"
                },
                success: function(f) {
                    ajax_success(f, "A=M", download_modified)
                },
                error: function(g, f, h) {
                    ajax_error(f, "A=M")
                },
                dataType: "text"
            })
        };
        download_modified = function() {
            if (b.on_notify != null) {
                b.on_notify("downloads", "started")
            }
            _log("download");
            var f = "";
            b.db.transaction(function(g) {
                g.executeSql("select lastupdate,tblname from gsyncTlist", [], function(h, k) {
                    for (var j = 0; j < k.rows.length; j++) {
                        f += k.rows.item(j).lastupdate + "," + k.rows.item(j).tblname + "\r\n"
                    }
                })
            }, function(g) {
                _err("gsynctlist: " + g.message)
            }, function() {
                _ver("performing A=FL");
                a.ajax({
                    type: "POST",
                    url: b.base_url,
                    data: {
                        A: "FL",
                        D: f
                    },
                    success: function(g) {
                        _ver("a=fl: " + g);
                        start_downloads(g)
                    },
                    error: function(h, g, i) {
                        ajax_error(g, "A=FL")
                    },
                    dataType: "text"
                })
            })
        };
        ajax_success = function(h, g, f) {
            _ver(g + " completed:\n" + h);
            if (h.length >= 6 && h.substr(0, 6) == "*ERROR") {
                return logout(h, g)
            }
            exec_commands(h, f)
        };
        ajax_error = function(f, h, g) {
            _err(h + " failed: " + f);
            if (g == null) {
                return logout(f, h)
            }
            next_upload(g)
        };
        next_upload = function(f) {
            if (b.copytbl.length != 0) {
                var g = b.copytbl.shift();
                return copy_from_tmp_sql_exec(g.qry, f)
            } else {
                if (b.processcmd.length != 0) {
                    var g = b.processcmd.shift();
                    return process_one_command(g.cmd, f)
                }
            }
            if (b.uploads.length == 0) {
                return next_download(f)
            }
            var h = b.uploads.shift();
            upload_table(h.tname, h.sql, f)
        };
        next_download = function(f) {
            if (b.copytbl.length != 0 && b.processcmd.length != 0) {
                return
            }
            if (b.downloads.length == 0) {
                if (f == null) {
                    return logout("End reached.", "next_download")
                }
                return f()
            }
            var g = b.downloads.shift();
            download_table(g.tname, f)
        };
        exec_commands = function(g, f) {
            b.db.transaction(function(h) {
                var j = g.split("\n");
                for (var k = 0; k < j.length; k++) {
                    b.processcmd.push({
                        cmd: j[k]
                    })
                }
            }, function(h) {
                logout(h.message, "exec_cmds")
            }, function() {
                next_upload(f)
            })
        };
        process_one_command = function(i, g) {
            _ver("=> " + i);
            if (i.length < 5) {
                next_upload(g);
                return
            }
            var f = "";
            var h = i.substr(0, 5);
            i = i.substr(5);
            var j = i.indexOf(":");
            if (j >= 0 && (i.indexOf(" ") < 0 || i.indexOf(" ") > j)) {
                f = i.substr(0, j);
                i = i.substr(j + 1)
            }
            if (h == "GDBE:" || h == "GDBX:") {
                b.db.transaction(function(k) {
                    process_gdbe(k, i, g)
                }, function(k) {
                    _ver("=> " + k.message);
                    next_upload(g)
                }, function() {
                    next_upload(g)
                })
            } else {
                if (h == "GDBC:") {
                    process_gdbc(f, i)
                } else {
                    if (h == "GGBC:") {
                        process_ggbc(f, i)
                    } else {
                        if (h == "GERR:") {
                            logout(i, "Forced Error")
                        }
                    }
                }
                next_upload(g)
            }
        };
        copy_from_tmp = function(f, l) {
            var h = b.raw_data.data.split("\n");
            var n = "";
            for (var k = 0; k < h.length; k++) {
                if (h[k].trim().length <= 0) {
                    continue
                }
                var o = h[k].split("\t");
                var m = "insert into gsyncDelta values( ";
                for (var g = 0; g < o.length; g++) {
                    m += "'" + o[g].replace("'", '"') + "',"
                }
                m = m.substr(0, m.length - 1) + ")";
                if (n == "") {
                    n = m
                }
                b.copytbl.push({
                    qry: m
                })
            }
        };
        copy_from_tmp_sql_exec = function(g, f) {
            b.db.transaction(function(h) {
                h.executeSql(g, [], function(i, j) {}, function(i, j) {
                    _err("copy: failed " + j.message)
                })
            }, function(h) {
                _ver("=> " + h.message);
                next_upload(f)
            }, function() {
                next_upload(f)
            })
        };
        process_gdbe = function(f, h, g) {
            if (h.length > 4 && h.substr(0, 4) == "copy") {
                return copy_from_tmp(f)
            }
            f.executeSql(h, [], function(i, j) {}, function(i, j) {})
        };
        process_ggbc = function(f, g) {
            if (f == "setuserid") {
                b.userid = g.substr(9)
            } else {
                if (f == "setsessionid") {
                    b.sessionid = g.substr(12)
                } else {
                    if (f == "setinstallid") {} else {
                        _log("unimplemented command: " + f)
                    }
                }
            }
        };
        process_gdbc = function(f, g) {
            b.uploads.push({
                tname: f,
                sql: g
            })
        };
        res_as_csv = function(h, g) {
            var j = "";
            if (g.rows.length > 0) {
                for (col in g.rows.item(0)) {
                    j += col + b.seperator
                }
                if (j.length > 0) {
                    j = j.substr(0, j.length - 1)
                }
                j += "\n"
            }
            for (var f = 0; f < g.rows.length; f++) {
                var k = g.rows.item(f);
                for (col in k) {
                    j += ("" + k[col]).replace(b.seperator, "    ") + b.seperator
                }
                if (j.length > 0) {
                    j = j.substr(0, j.length - 1)
                }
                j += "\n"
            }
            return j
        };
        upload_table = function(j, k, g) {
            if (b.on_notify != null) {
                b.on_notify("upload", j)
            }
            _log("upload: " + j);
            var h = "";
            for (var f = 0; f < b.ts.length; f++) {
                if (b.ts[f].name == j) {
                    h = b.ts[f].ts;
                    break
                }
            }
            b.db.transaction(function(i) {
                i.executeSql(k, [], function(m, n) {
                    data = res_as_csv(j, n);
                    _ver("uploading: " + data);
                    if (data.length == 0 && !b.upload_zerokb) {
                        return next_upload(g)
                    }
                    var o = "-------------------------7d32511a3010c";
                    var l = "";
                    l += "--" + o + '\r\nContent-Disposition: form-data; name="A"\r\n\r\nU\r\n';
                    l += "--" + o + '\r\nContent-Disposition: form-data; name="SEP"\r\n\r\n9\r\n';
                    l += "--" + o + '\r\nContent-Disposition: form-data; name="TS"\r\n\r\n' + h + "\r\n";
                    l += "--" + o + '\r\nContent-Disposition: form-data; name="F"; filename="' + j + '"\r\n';
                    l += "Content-Type: text/plain\r\n\r\n";
                    l += data + "\r\n--" + o + "--\r\n\r\n";
                    a.ajax({
                        type: "POST",
                        contentType: "multipart/form-data; boundary=" + o,
                        processData: false,
                        cache: false,
                        url: b.upld_url,
                        data: l,
                        headers: b.upld_headers,
                        success: function(p) {
                            ajax_success(p, "Upload " + j, g)
                        },
                        error: function(r, p, q) {
                            ajax_error(p, "Upload " + j, null)
                        },
                        dataType: "text"
                    })
                })
            }, function(i) {
                next_upload(g)
            }, function(i) {})
        };
        start_downloads = function(j, h) {
            var f = j.split(";");
            for (var g = 0; g < f.length; g += 2) {
                if (f[g].indexOf(".") < 0 && f[g].length > 0) {
                    b.downloads.push({
                        tname: f[g]
                    })
                }
            }
            next_download(h)
        };
        download_table = function(g, f) {
            if (b.on_notify != null) {
                b.on_notify("download", g)
            }
            _log("download: " + g);
            a.ajax({
                type: "POST",
                url: b.base_url,
                data: {
                    A: "DN",
                    E: 0,
                    D: g,
                    withds: 1
                },
                success: function(h) {
                    download_table_ds(g, h, f)
                },
                error: function(i, h, k) {
                    ajax_error(h, "DN:" + g, f)
                },
                dataType: "text"
            })
        };
        download_table_ds = function(g, h, f) {
            _ver(h);
            var i = -1;
            if ((i = h.indexOf("\r\nAW2387MS24DAS1Q24FASF1214GD6GSG3FSA12\r\n")) > 0) {
                b.raw_data = {
                    tname: g,
                    data: h.substr(i + 41)
                };
                ajax_success(h.substr(0, i), "DS:" + g, f);
                return
            }
            if (b.on_notify != null) {
                b.on_notify("download-schema", g)
            }
            _log("download-ds: " + g);
            b.raw_data = {
                tname: g,
                data: h
            };
            a.ajax({
                type: "POST",
                url: b.base_url,
                data: {
                    A: "DS",
                    D: g
                },
                success: function(j) {
                    ajax_success(j, "DS:" + g, f)
                },
                error: function(l, k, m) {
                    ajax_error(k, "DS:" + g, f)
                },
                dataType: "text"
            })
        };
        return {}
    }
})(jQuery);
