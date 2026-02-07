<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'attendance_date',
        'check_in_time',
        'check_out_time',
        'check_in_latitude',
        'check_in_longitude',
        'check_in_address',
        'check_out_latitude',
        'check_out_longitude',
        'check_out_address',
        'notes',
    ];

    protected $casts = [
        'attendance_date' => 'date',
        'check_in_time' => 'datetime',
        'check_out_time' => 'datetime',
        'check_in_latitude' => 'decimal:8',
        'check_in_longitude' => 'decimal:8',
        'check_out_latitude' => 'decimal:8',
        'check_out_longitude' => 'decimal:8',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the duration of the work day in hours.
     */
    public function getDurationInHours(): ?float
    {
        if ($this->check_in_time && $this->check_out_time) {
            return $this->check_out_time->diffInHours($this->check_in_time, allow_negative: true) +
                   $this->check_out_time->diffInMinutes($this->check_in_time, allow_negative: true) % 60 / 60;
        }
        return null;
    }
}
