package com.hackathon.backend.repository;

import com.hackathon.backend.entity.ConnectionRequest;
import com.hackathon.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConnectionRequestRepository extends JpaRepository<ConnectionRequest, Long> {

    Optional<ConnectionRequest> findBySenderAndReceiver(User sender, User receiver);

    List<ConnectionRequest> findByReceiverAndStatus(User receiver, ConnectionRequest.RequestStatus status);

    List<ConnectionRequest> findBySenderAndStatus(User sender, ConnectionRequest.RequestStatus status);

    @Query("SELECT COUNT(cr) FROM ConnectionRequest cr WHERE cr.status = 'ACCEPTED'")
    Long countSuccessfulConnections();

    boolean existsBySenderAndReceiverAndStatusIn(User sender, User receiver, List<ConnectionRequest.RequestStatus> statuses);
}
