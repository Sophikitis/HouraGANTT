<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use Sunra\PhpSimple\HtmlDomParser;

use App\User;
use Illuminate\Http\Request;
class VerifyController extends Controller
{
    public function verify(Request $request){
        $document = HtmlDomParser::str_get_html($request->text);
        $v =  $document->find('option[selected]', 0)->value;
        dd($v);
        //$document->find($selector);
    }
}
