unificationBAXA.factory('commonFileFunctionFactory',
  function($log, $cordovaFile, $cordovaCamera) {
    'use strict';
    return {
      freeSpace: function() {
        $cordovaFile.getFreeDiskSpace()
          .then(function(success) {
            return success;
          }, function(error) {
            $log.debug("FileFreeSpace_Error: ", error);
          });
      },
      createFile: function($dir, $file, $replace) {
        $cordovaFile.createFile($dir, $file, $replace)
          .then(function(success) {
            $log.debug("FileCreate_Success");
            $log.debug(success);
          }, function(error) {
            $log.debug("FileCreate_Error: ");
            $log.debug(error);
          });
      },
      createDir: function(rootPath,$dir, success, error) {
        $log.debug("createDir: ", "" + $dir);
        if ($dir.indexOf("/") === -1) {
          $cordovaFile.createDir(rootPath, $dir, true)
            .then(function(data) {
              $log.debug("FileDirCreate_Success: ", JSON.toString(success));
              success(data);
            }, function(err) {
              $log.debug("FileDirCreate_Error: ", JSON.toString(error));
              error(err);
            });
        } else {
          var sanitized = $dir
            .replace(/^http\:\/\//, '') /** remove the leading http:// (temporarily)**/
            .replace(/\/+/g, '/') /** replace consecutive slashes with a single slash**/
            .replace(/\/+$/, '');
          var dirs = sanitized.split("/");
          for (var d = 1; d <= dirs.length; d++) {
            var createDirPath = sanitized.split('/', d);
            $log.debug("createDirPath: ", "" + createDirPath);
            $log.debug("d: ", d);
            $log.debug("dirs.length: ", dirs.length);

            var createDir = $cordovaFile.createDir(rootPath , createDirPath.join("/"), true);
            if (parseInt(d) == dirs.length) {
              createDir.then(function(data) {
                $log.debug("FileDirCreate_Success: ", JSON.toString(success));
                success(data);
              }, function(err) {
                $log.debug("FileDirCreate_Error: ", JSON.toString(error));
                error(err);
              });
            }
          }
        }
      },
      checkFile: function($file, $dir) {
        $cordovaFile.checkFile($dir, $file)
          .then(function(success) {
            $log.debug("FileExists_Success: ", JSON.toString(success));
            $log.debug(success);
          }, function(error) {
            $log.debug("FileExists_Error: ", JSON.toString(error));
          });
      },
      checkDir: function(rootPath,$dir) {
        $cordovaFile.checkDir(rootPath, $dir)
          .then(function(success) {
            $log.debug("FileDirExists_Success: ", JSON.toString(success));
            return success;
          }, function(error) {
            $log.debug("FileDirExists_Error: ", JSON.toString(error));
          });
      },
      removeFile: function($dir, $file) {
        $cordovaFile.removeFile($dir, $file)
          .then(function(success) {
            $log.debug("FileRemove_Success: ");
            $log.debug(success);
          }, function(error) {
            $log.debug("FileRemove_Error: ", error);
          });
      },
      removeDir: function(rootPath,$dir) {
        $cordovaFile.removeRecursively(rootPath, $dir)
          .then(function(success) {
            $log.debug("FileDirRemove_Success: ");
            $log.debug(success);
          }, function(error) {
            $log.debug("FileDirRemove_Error: ", error);
          });
      },
      moveDir: function(rootPath,$dir, $newDir) {
        $cordovaFile.moveDir(rootPath, $dir, cordova.file.tempDirectory, $newDir)
          .then(function(success) {
            $log.debug("FileDirMove_Success: ");
            $log.debug(success);
          }, function(error) {
            $log.debug("FileDirMove_Error: ");
          });
      },
      moveFile: function($dir, $file, $newDir, $newFile) {
        if ($newFile === "") {
          $cordovaFile.moveFile($dir, $file, $newDir)
            .then(function(success) {
              $log.debug("FileMove_Success: ", JSON.stringify(success));
            }, function(error) {
              $log.debug("FileMove_Error: ", JSON.stringify(error));
            });
        } else {
          $cordovaFile.moveFile($dir, $file, $newDir, $newFile)
            .then(function(success) {
              $log.debug("FileMove_Success: ", JSON.stringify(success));
            }, function(error) {
              $log.debug("FileMove_Error: ", JSON.stringify(error));
            });
        }

      },
      copyFile: function($dir, $file, $newDir, $newFile) {
        if ($newFile === "") {
          $cordovaFile.copyFile($dir, $file, $dir)
            .then(function(success) {
              $log.debug("FileCopy_Success: ");
              $log.debug(success);
            }, function(error) {
              $log.debug("FileCopy_Error: ", error);
            });
        } else {
          $cordovaFile.copyFile($dir, $file, $dir, $newFile)
            .then(function(success) {
              $log.debug("FileCopy_Success: ");
              $log.debug(success);
            }, function(error) {
              $log.debug("FileCopy_Error: ");
              $log.debug(error);
            });
        }
      },
      read: function($dir, $file, cb) {
        $cordovaFile.readAsText($dir, $file)
          .then(function(success) {
            $log.debug("FileRead_Success: " + success.length);
            if (success) {
              cb(JSON.parse(success));
            } else {
              cb([]);
            }
          }, function(error) {
            $log.debug("FileRead_Error: ", error.toString());
          });
      },
      readFiles: function($dir, cb) {
        window.resolveLocalFileSystemURL($dir, function(directoryEntry) {
            var dirReader = directoryEntry.createReader();
            dirReader.readEntries(function(entries) {
              cb(entries);
            });
          },
          function(error) {
            $log.debug(error);
          });
      },
      write: function($dir, $file, $text) {
        data = JSON.stringify($text, null, '\t');
        window.resolveLocalFileSystemURL($dir, function(directoryEntry) {
          directoryEntry.getFile($file, {
            create: true
          }, function(fileEntry) {
            fileEntry.createWriter(function(fileWriter) {
              fileWriter.onwriteend = function(e) {
                /** for real-world usage, you might consider passing a success callback**/
                $log.debug('Write of file "' + $file + '" completed.');
              };

              fileWriter.onerror = function(e) {
                /** you could hook this up with our global error handler, or pass in an error callback**/
                $log.debug('Write failed: ' + e.toString());
              };
              var blob = new Blob([data], {
                type: 'text/plain'
              });
              fileWriter.write(blob);
              return;
            }, errorHandler.bind(null, $file));
          }, errorHandler.bind(null, $file));
        }, errorHandler.bind(null, $file));
      },
      savePicture: function(destPath) {
        var options = {
          quality: 50,
          destinationType: Camera.DestinationType.FILE_URI,
          sourceType: Camera.PictureSourceType.CAMERA,
          allowEdit: false,
          encodingType: Camera.EncodingType.JPEG,
          /**targetWidth: 350,
            targetHeight: 350,**/
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false,
          correctOrientation: true
        };
        $cordovaCamera.getPicture(options).then(function(sourcePath) {
          var sourceDirectory = sourcePath.substring(0, sourcePath.lastIndexOf('/') + 1);
          var sourceFileName = sourcePath.substring(sourcePath.lastIndexOf('/') + 1, sourcePath.length);
          $cordovaFile.moveFile(sourceDirectory, sourceFileName, destPath)
            .then(function(success) {
              $log.debug("FileMove_Success: ", JSON.stringify(success));
            }, function(error) {
              $log.debug("FileMove_Error: ", JSON.stringify(error));
            });
        });
      },
    createNote: function(note,notesPath,notesFileName,success,error) {
          window.resolveLocalFileSystemURL(notesPath, function(directoryEntry) {
            directoryEntry.getFile(notesFileName, {
              create: true
            }, function(fileEntry) {
              fileEntry.createWriter(function(fileWriter) {
                fileWriter.onwriteend = function(e) {
                  $log.debug('Write of file "' + notesFileName + '" completed.');
                  success(true);
                };

                fileWriter.onerror = function(e) {
                  // you could hook this up with our global error handler, or pass in an error callback
                  $log.debug('Write failed: ' + e.toString());
                  error(e.toString());
                };
                var blob = new Blob([JSON.stringify(note, null, '\t')], {
                  type: 'text/plain'
                });
                fileWriter.write(blob);
              },$log.debug(""));
            }, $log.debug(""));
          }, $log.debug(""));
        }
    };
  });
