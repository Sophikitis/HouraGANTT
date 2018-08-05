<?php
function getUserInfo($token) {
     $user = \DB::table('users')->where('token', $token)->first();
    return $user;
}

function InsertLog($function_name,$project_id,$user_id){
  $id =  \DB::table('logs')->insertGetId(
        ['function_name' => $function_name, 'project_id' => $project_id,'user_id' => $user_id]
    );
  return $id;
}

function checkRight($user_id,$project_id){
     $right = \DB::table('project_user')->where([
         ['user_id', '=', $user_id],
         ['project_id', '=', $project_id],
     ])->first();
     if($right){
        if($right->right_id === 1  || $right->project_owner === 0){
            return true;
        }else{
            return false;
        }
     }
  return false; 
}

function getWorkdays($date1, $date2, $workSat = FALSE, $patron = NULL) {
    if (!defined('SATURDAY')) define('SATURDAY', 6);
    if (!defined('SUNDAY')) define('SUNDAY', 0);
    // Array of all public festivities
    $publicHolidays = array('01-01', '01-06', '04-25', '05-01', '06-02', '08-15', '11-01', '12-08', '12-25', '12-26');
    // The Patron day (if any) is added to public festivities
    if ($patron) {
        $publicHolidays[] = $patron;
    }
    /*
     * Array of all Easter Mondays in the given interval
     */
    $yearStart = date('Y', strtotime($date1));
    $yearEnd   = date('Y', strtotime($date2));
    for ($i = $yearStart; $i <= $yearEnd; $i++) {
        $easter = date('Y-m-d', easter_date($i));
        list($y, $m, $g) = explode("-", $easter);
        $monday = mktime(0,0,0, date($m), date($g)+1, date($y));
        $easterMondays[] = $monday;
    }
    $start = strtotime($date1);
    $end   = strtotime($date2);
    $workdays = 0;
    for ($i = $start; $i <= $end; $i = strtotime("+1 day", $i)) {
        $day = date("w", $i);  // 0=sun, 1=mon, ..., 6=sat
        $mmgg = date('m-d', $i);
        if ($day != SUNDAY &&
            !in_array($mmgg, $publicHolidays) &&
            !in_array($i, $easterMondays) &&
            !($day == SATURDAY && $workSat == FALSE)) {
            $workdays++;
        }
    }
    return intval($workdays);
}

function addDayswithdate($date,$days){

    $date = strtotime("+".$days." days", strtotime($date));
    return  date("Y-m-d", $date);

}
function removeTime($date){
    date("Y-m-d", strtotime($date));
}

function checkProjectRight($id_project, $id_user) {
  $render = DB::table('project_user')
            ->where('project_id', $id_project)
            ->where('user_id', $id_user)
            ->first();
  if($render) {
      return true;
  } else {
      return false;
  }
}

function isOwnerProject($id_project, $id_user) {
  $right = DB::table('project_user')
            ->where('project_id', $id_project)
            ->where('user_id', $id_user)
            ->first();
  if($right){
      if($right->project_owner === 0){
          return true;
      }else{
          return false;
      }
   }
   return false; 
}