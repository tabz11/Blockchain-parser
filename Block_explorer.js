//********************************************************************************///
////This software reads Blk file from blk file and write to Postgres database///////
//*******************************************************************************//

var pg = require('pg');
var fs = require('fs');
var glob = require('glob')
var bitcore = require('bitcoinjs-lib');
var bigint = require('big-integer');
var CombinedStream = require('combined-stream')
var BlockStream = require('blkdat-stream');

var conString = "postgres://postgres:123@localhost:5432/myBitcoinData"; // Your database link here
var client;k=0;
pg.connect(conString,function(err,client,done) //connecting to database
            {if(err)
                console.log(err);
                client.query('CREATE TABLE IF NOT EXISTS '+ ' Blockinfo_2 (Block_ID INT NOT NULL PRIMARY KEY,' + 'block_date text,'+'block_time text,'+ 'Num_trans INT NOT NULL );')
                client.query('CREATE TABLE IF NOT EXISTS '+' transac_info(Transaction_ID varchar(100) NOT NULL PRIMARY KEY,'+'Tranaction_time_stamp TIMESTAMP, '+'Transaction_amount INT);')
if (pg.connect == true)
console.log('Database created');
glob('C:/Users/Tooba/AppData/Roaming/Bitcoin/blocks/**/blk*.dat', function (err, fileNames) {
  if (err){ console.log(err) }
  else {console.log(fileNames);}
  var cs = new CombinedStream()
  fileNames.forEach(function (fileName) {
  console.log('processing '+ fileName);
  cs.append(fs.createReadStream(fileName, { mode: '0444' }))})
  var bds = new BlockStream()
  bds.on('data', function (data) 
  { console.log('>> Read block (', k, ')');
    console.log(data);
    var version = data.readUInt32LE(0);      //-- Calculating version of the Block
    var pre_hash_1 = data.readUIntLE(4,32).toString(16);  //-- Caluclation Previous block hash
    var merkle_root = data.readUIntLE(36,32); // calculating merkle root
    var time_s = data.readUInt32LE(68);       //-- Calculating Timestamp of the Block
    var trans_counter =data. readUIntLE(80,1);
    var trans_hash = data.readUIntLE(81, 32);
    if(time_s == null){console.log('no time info');}
    var d = new Date(time_s*1000); 
    console.log('Possible Date ----->'+  d);
    var d_only = d.getDate();
    console.log(d_only);
    var t_only = d.getTime(); 
    console.log(t_only);
    client.query('INSERT INTO Blockinfo_2 (Block_ID,block_date,block_time,Num_trans) VALUES ('+k+','+d_only+','+t_only+','+trans_counter+')');
    console.log('Data Inserted successfully!');
    console.log('Possibly version------>'+ version.toString(16));
    console.log('Possible Previous Hash ---->>'+ pre_hash_1);
    console.log('Possible Merkle Root------>'+merkle_root.toString(16));
    console.log('Possible Transaction Counter ---->' + trans_counter);
    console.log('Possible Transaction Hash ------->' + trans_hash.toString(16));
    
    k++})
    cs.pipe(bds); }) });
    if (pg.connect== true){console.log('Database is still online.');}
 

