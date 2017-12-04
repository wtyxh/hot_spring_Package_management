/**
 * Created by wutao on 2017/12/1.
 */
//接口地址
let url_host = 'http://192.168.137.187:8085/';

//出品部门查询
$.ajax({
    type:'get',
    async: true,
    url: url_host+'cookbook/query/no/page/type/data.shtml',
    data:{},
    success: function (res) {
        //将查询到的出品部门循环添加到出品部门上
        let data = res.data;
        for (let i = 0; i <= data.length-1; i++){
            let r_html = `<option id="${data[i].id}">${data[i].tName}</option>`;
            $('#bumen').append(r_html);
        }
        //查询菜品类别和套餐
        changecaip();
    },
    error: function (res) {

    }
});
//菜品类别查询
function findliebie(flb) {
    $.ajax({
        type:'get',
        async: false,
        url: url_host+'cookbook/query/menu/sub/type/by/id/data.shtml',
        data:flb,
        success: function (res) {
            //将查询到的菜品类别循环添加到菜品类别select上，并如果查询到的数据为空，则添加为无
            let data = res.data;
            if (res.errorCode !== 0){
                let r_html = `<option>无</option>`;
                $('#leibie').append(r_html);
            }else{
                let data = res.data;
                for(let i = 0; i <= data.length-1; i++){
                    let r_html = `<option sid="${data[i].id}">${data[i].stName}</option>`
                    $('#leibie').append(r_html)
                }
            }
        },
        error: function (res) {

        }
    });
}
//出品部门改变时加载菜品类别
function changecaip() {
    //移除菜品类别以便于后面重新加载
    $('#leibie').empty();
    //将查询到的出品部门id查询出来后包为对象给findliebie方法查询菜品类别
    let id = $('#bumen').find('option:selected').attr('id');
    let flb = {
        tid: id
    };
    findliebie(flb);
    //查出菜品类别的sid并给addtaocan方法查询套餐，如果菜品类别为空，则传参为出品类别的id再加上isSub
    let sid = $('#leibie').find('option:selected').attr('sid');
    let data;
    sid == undefined ?
        data = {
            isSub: 1,
            tid: id
        } : data = {
                stid: sid
        };
    addtaocan(data);

}
//改变部门的时候添加菜品类别
$('#bumen').change(function (res) {
    changecaip();
});

//改变菜品类别时候时候加载套餐
$('#leibie').change(function () {
    let sid = $('#leibie').find('option:selected').attr('sid');
    let datas = {
        stid: sid
    };

    addtaocan(datas);
});
//搜索加载套餐
$('.sr_img').click(function () {
    sraddtc();
});
//搜索加载套餐方法
function sraddtc() {
    let s_val = $('.sr_input input').val();
    let b_id = $('#bumen').find('option:selected').attr('id');
    let l_sid = $('#leibie').find('option:selected').attr('sid');
    let datas;
    l_sid == undefined ?
            datas = {
                keyWord: s_val,
                isSub: 1,
                tid: b_id
            } : datas = {
                keyWord: s_val,
                stid:l_sid
            };
    addtaocan(datas);

}

//搜索按钮按下enter开始搜索
$('.sr_input input').keyup(function (ev) {
    let keyCode = ev.which;
    if (keyCode == 13){
        sraddtc();
    }
})



//加载套餐
function addtaocan(datas) {
    $('#cp_list').empty();
    $.ajax({
        type: 'get',
        async: true,
        url: url_host + 'cookbook/query/menu/detail/data.shtml',
        data: datas,
        success: function (res) {
            //将获取到的数据循环添加到html
            console.log(datas)
            if(res.errorCode !== 0){
                let r_html = '<li><span>该类别暂无菜品</span></li>';
                $('#cp_list').append(r_html);
            }else {
                let data = res.data.list;
                for (let i = 0; i <= data.length-1; i++){
                    let r_html = `<li onclick="showguige('${i}')"><span>${data[i].cbName}</span></li>`;
                    $('#cp_list').append(r_html);
                }
            }
        },
        error: function (err) {
            
        }
    })
}

//规格显示
function showguige(guige) {
    let s_val = $('.sr_input input').val();
    let b_id = $('#bumen').find('option:selected').attr('id');
    let l_sid = $('#leibie').find('option:selected').attr('sid');
    let datas;
    l_sid == undefined ?
        datas = {
            keyWord: s_val,
            isSub: 1,
            tid: b_id
        } : datas = {
        keyWord: s_val,
        stid:l_sid
    };
    //开启模态框
    $('#ggModal').modal({
        keyboard: true
    });
    $.ajax({
        type: 'get',
        async: true,
        url: url_host + 'cookbook/query/menu/detail/data.shtml',
        data: datas,
        success: function (res) {
            let data = res.data.list[guige];
            let r_html = `
                        <p class="ggf_title" cdName="${data.cbName}">${data.cbName}：</p>
                        <p class="ggf_content">
                            <input type="text" name="id" hidden="hidden" value="${data.id}" />
                             <input type="text" name="tid" hidden="hidden" value="${data.tid}" />
                              <input type="text" name="stid" hidden="hidden" value="${data.stid}" />
                            <span onclick="setggfca('0');" class="ggfc_active" spec="${data.spec1}" price="${data.price1}">${data.spec1}${data.unit}</span>
                            <span onclick="setggfca('1');" spec="${data.spec2}" price="${data.price2}">${data.spec2}${data.unit}</span>
                            <span onclick="setggfca('2');" spec="${data.spec3}" price="${data.price3}">${data.spec3}${data.unit}</span>
                        </p>`;
            $('#ggformdiv').empty();
            $('#ggformdiv').append(r_html);

        },
        error: function (err) {

        }
    })
}
//规格显示时候的选择样式
function setggfca(sflabel) {
    $('.ggf_content span').removeClass('ggfc_active');
    $('.ggf_content span:eq('+sflabel+')').addClass('ggfc_active');
}
//提交套餐
let customLabe = 0;
$('#ggbut').click(function () {
    let cbName = $('#ggformdiv .ggf_title').attr('cdName'),
        id = $('#ggformdiv .ggf_content input[name="id"]').val(),
        tid = $('#ggformdiv .ggf_content input[name="tid"]').val(),
        stid = $('#ggformdiv .ggf_content input[name="stid"]').val(),
        spec = $('.ggfc_active').attr('spec'),
        price = $('.ggfc_active').attr('price');
    //定义小计
    let xioaji = parseInt(price);
    //定义form表单里面的内容
    let r_html = `<li custom_labe = '${customLabe}'>
                                <input class="hidden" type="text" hidden="hidden" name="mealDetails[${customLabe}].cbid" value="${id}" >
                                <input class="hidden" type="text" hidden="hidden" name="mealDetails[${customLabe}].tid" value="${tid}" >
                                <input class="hidden" type="text" hidden="hidden" name="mealDetails[${customLabe}].stid" value="${stid}" >
                                <input class="hidden" type="text" hidden="hidden" name="mealDetails[${customLabe}].tcSpec" value="${spec}" >
                                <input readonly unselectable="on" name="mealDetails[${customLabe}].cbName" class="mrlt_name" value="${cbName}" />
                                <span class="mrlt_number"><span onclick="mrltnAinus('${customLabe}')">-</span><input readonly unselectable="on" name="mealDetails[${customLabe}].tcNum" class="mrltn_text" value="1" /><span onclick="mrltnAdd('${customLabe}')">+</span></span>
                                <input readonly unselectable="on" name="mealDetails[${customLabe}].tcPrice" class="mrlt_unit" value="${price}" />
                                <input readonly unselectable="on" class="mrlt_subtota" value="${xioaji}" />
                            </li>`;
    $('.mrl_content ul').append(r_html);
    customLabe++;
    //关闭模态框
    $('#ggModal').modal('hide');
    endpay();
});


//显示套餐名字
$('.mr_combo input').change(function () {
    let mrc_text = $(this).val();
    $('.mr_name p').text(mrc_text);
    //赋值为表单的套餐名字
    $('input[name="smName"]').val(mrc_text);
    isTcNmae();
});
//套餐名按enter时候显示套餐名字
$('.mr_combo input').keyup(function (ev) {
    let keyCode = ev.which;
    if(keyCode == 13){
        let mrc_text = $('.mr_combo input').val();
        $('.mr_name p').text(mrc_text);
        //赋值为表单的套餐名字
        $('input[name="smName"]').val(mrc_text);
        isTcNmae();
    }
});
//查询套餐名字是否已存在
function isTcNmae() {
    let tc_name = $('.mr_combo input').val();
    $.ajax({
        type: 'get',
        async: true,
        url:url_host + 'cookbook/query/menu/setmeal/by/name/data.shtml',
        data: {
            sName: tc_name
        },
        success: function (res) {
            //用户名已重复
            if(res !== ''){
                //确认冲突套餐名标识
                $('.mr_combo input').attr('pass','yes');
                $('.mr_combo input').css('border','1px solid red');
                $('#ctNameModal').modal({
                    backdrop: 'static',
                    keyboard: false
                })
            }else{
                $('.mr_combo input').css('border','1px solid #66A0CD');
                //确认不冲突套餐名标识
                $('.mr_combo input').attr('pass','no');
            }
        },
        error: function (err) {
            
        }
    })
};
//重新另起套餐名名
$('#ctNameclose').click(function () {
    //清空套餐名字
    $('input[name="smName"]').val('');
    $('.mr_name p').text('');
    $('.mr_combo input').val('');
});
//继续用重复的套餐名
$('#ctNamebut').click(function () {
    $('#ctNameModal').modal('hide');
});
//详细菜名数量增加
function mrltnAdd(mlad) {
    let a = $('.mrl_content ul li[custom_labe="'+mlad+'"] .mrlt_unit');
    let c = $('.mrl_content ul li[custom_labe="'+mlad+'"] .mrlt_number .mrltn_text');
    let d = $('.mrl_content ul li[custom_labe="'+mlad+'"] .mrlt_subtota');
    let aText = parseInt(a.val());
    let cText = parseInt(c.val());
    let cAdd = cText+1;
    
    c.val(cAdd);
    d.val(aText*(cAdd));
    endpay();
}
//详细菜名数量减少
function mrltnAinus(mlai) {
    let a = $('.mrl_content ul li[custom_labe="'+mlai+'"] .mrlt_unit');
    let c = $('.mrl_content ul li[custom_labe="'+mlai+'"] .mrlt_number .mrltn_text');
    let d = $('.mrl_content ul li[custom_labe="'+mlai+'"] .mrlt_subtota');
    let aText = parseInt(a.val());
    let cText = parseInt(c.val());
    let cAinus = cText-1;
    if(cAinus == 0){
        cAinus = 1;
    }
    c.val(cAinus);
    d.val(aText*(cAinus));
    endpay();
}
//最终消费的值
function endpay() {
    let mrlt_subtota = $('.mrlt_subtota').length;
    let endNum = 0;
    for (let i = 1; i <= mrlt_subtota - 1; i++) {
        let a = $('.mrlt_subtota:eq(' + i + ')').val();
        let an = parseInt(a);
        endNum = an + endNum;
    }
    //最终消费的值
    $('.mra_final span').text(endNum);
    //套餐原总价
    $('.tcyzj').val(endNum);
    //折扣
    let zkNum = $('.mr_price select').find('option:selected').val();
    $('input[name="tcDiscount"]').val(zkNum);
    //套餐价格
    let tcjgNum = zkNum*endNum;
    tcjgNum = tcjgNum.toFixed(2);
    $('input[name="tcjg"]').val(tcjgNum);
    $('input[name="stPrice"]').val(tcjgNum);
}
//改变折扣值的时候更改价格
$('.mr_price select').change(function () {
    endpay();
});
//是否可单点赋值给表单的是否可单点
$('#isdd').change(function () {
    let dd = $('#isdd').find('option:selected').val();
    $('input[name="isdd"]').val(dd)
});
//是否可打折赋值给表单的是否可打折
$('#isdz').change(function () {
    let dz = $('#isdz').find('option:selected').val();
    $('input[name="isNo"]').val(dz)
});
//单位选择更改
$('.mr_combo select').change(function () {
    let mr = $('.mr_combo select').find('option:selected').val();
    $('input[name="smUnit"]').val(mr);
});
//重置所有的菜单
$('.mraf_reset').click(function () {
    $('#reModal').modal({
        keyboard: true
    })
});
//确认重置所有的已点菜单
$('#rebut').click(function () {
    $('.mrl_content ul li').remove();
    $('#reModal').modal('hide');
    endpay();
});
$('#upgoform').click(function () {
    console.log('ccc')
});
//表单提交
function upform() {

    //套餐名的非空验证（通过模态框提示）
    if($('input[name="smName"]').val() == ''){
        $('#jgModalLabel').text('');
        $('#jgformdiv').empty();
        let jg_content = `<p>请填写套餐名</p>`
        $('#jgformdiv').text('请填写套餐名');
        $('#jgformdiv').append(jg_content);
        $('#jgbut').hide();
        $('#jgModal').modal({
            keyboard: true
        });
    //是否有详细菜品（通过模态框提示）
    }else if($('.mrl_content ul li').length < 1){
        $('#jgModalLabel').text('');
        $('#jgformdiv').empty();
        let jg_content = `<p>请添加套餐菜品</p>`;
        $('#jgformdiv').append(jg_content);
        $('#jgbut').hide();
        $('#jgModal').modal({
            keyboard: true
        });
    //是否确认提交订单（通过模态框提示）
    }else{
        $('#jgModalLabel').text('');
        $('#jgformdiv').empty();
        let jgt;
        if ($('.mr_combo input').attr('pass') == 'yes'){
            jgt = `<p>确认提交套餐？</p>
                   <span id="tcmcf" style="width:100%;color: red;display: inline-block;text-align: center">套餐名已重复</span>`;
        }else{
            jgt = `<p>确认提交套餐？</p>`;
        }
        $('#jgformdiv').append(jgt);
        $('#jgbut').text('提交套餐');
        $('#jgbut').show();
        $('#jgModal').modal({
            backdrop: 'static',
            keyboard: false
        });
    }
    return false;
};
//判断键盘按enter事件时候阻止表单提交
$(document).keydown(function (ev) {
    let keyCode = ev.which;
    if(keyCode == 13){
        return false;
    }
});
//确认提交表单数据
$('#jgbut').click(function () {

    uploadformGo();
    $('#jgModal').modal('hide');
    showmemgc();
})
//formdata通过ajax提交表单数据（即通过确定来提交相关的信息）
function uploadformGo() {
    let data_ = new FormData(document.getElementById("mrlc_form"));
    $.ajax({
        url: url_host + "cookbook/add/menu/set/meal/data.shtml",
        type: "POST",
        processData: false,
        contentType: false,
        data: data_,
        xhr: function () {
            myXhr = $.ajaxSettings.xhr();
            if(myXhr.upload){
                console.log('开始检测上传文件进度....');
                myXhr.upload.addEventListener('progress',function(e) {
                    if (e.lengthComputable) {
                        var percent = Math.floor(e.loaded/e.total*100);
                        if(percent <= 100) {
                            console.log('开始上传'+percent);
                            $('#jindut').css('width',percent+'%');
                            $('#jindutext').text(percent);
                        }
                        if(percent >= 100) {

                            console.log('文件上传完毕！')
                        }
                    }
                }, false);
            }
            return myXhr;
        },
        success: function(data) {
            console.log('请求成功！');
            console.log(data);
            $('.mengc').hide();
            //数据请求成功（通过模态框提示）
            if(data.errorCode == 0) {
                // alert(data.msg);
                $('#jgformdiv').empty();
                $('#jgModalLabel').text('');
                let jgt = `<p>套餐添加成功</p>`;
                $('#jgformdiv').append(jgt);
                $('#jgbut').hide();
                $('#jgModal').modal({
                    backdrop: 'static',
                    keyboard: false
                });
                $('#jgclose').click(function () {
                    location.reload();
                });
            //数据请求失败，例如参数错误等等
            } else {
                $('#jgformdiv').empty();
                $('#jgModalLabel').text('');
                let jgt = `<p>${data.msg}</p>`;
                $('#jgformdiv').append(jgt);
                $('#jgbut').hide();
                $('#jgModal').modal({
                    backdrop: 'static',
                    keyboard: false
                });
            }
        },
        //数据请求失败
        error: function(res) {
            // alert("请求失败！");
            $('#jgformdiv').empty();
            $('#jgModalLabel').text('');
            let jgt = `<p>套餐添加失败</p>`;
            $('#jgformdiv').append(jgt);
            $('#jgbut').hide();
            $('#jgModal').modal({
                backdrop: 'static',
                keyboard: false
            });
        }
    });
}

//显示文件上传
$('.uploadImg').click(function () {
    $('#imgModal').modal({
        keyboard: true
    })
});

//初始化fileinput控件（第一次初始化文件上传组件）
$("#file-1").fileinput({
    uploadUrl: '#', // you must set a valid URL here else you will get an error
    allowedFileExtensions : ['jpg', 'png','gif'],
    overwriteInitial: false,
    // maxFileSize: 1000,
    maxFilesNum: 10,
    showUpload: false,
    //allowedFileTypes: ['image', 'video', 'flash'],
    slugCallback: function(filename) {
        return filename.replace('(', '_').replace(']', '_');
    }
});

//提交订单时候显示蒙层，以致于不能反复提交
function showmemgc() {
    $('.mengc').show();
}

