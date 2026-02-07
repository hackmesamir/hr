<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use PHPUnit\Logging\OpenTestReporting\Status;

class CreateClientsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('parent_name')->nullable();
            $table->string('client_name')->nullable();
            $table->text('address')->nullable();
            $table->text('client_address')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('responsible_person')->nullable();
            $table->string('contact_person')->nullable();
            $table->string('financial_year')->nullable();
            $table->enum('audit_type', ['statutory', 'external'])->default('statutory');
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('clients');
    }
}
